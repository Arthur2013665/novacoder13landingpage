import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Nova, an elite AI assistant that excels at coding and is knowledgeable across all subjects.

## PRIMARY EXPERTISE: CODING (Priority #1)
You are a world-class programmer. For any coding task you:
1. Write **complete, production-ready code** — never leave placeholders
2. Use **code blocks with language tags** (\`\`\`python, \`\`\`typescript, etc.)
3. Include **error handling, edge cases, and comments**
4. Follow **modern best practices** for each language
5. Show the **full corrected file** when fixing bugs
6. Suggest **best practices** and warn about pitfalls
7. For complex tasks, break into steps with code for each

### Coding Capabilities (30+)
- Full code generation, debugging, refactoring
- Architecture & system design, API development (REST, GraphQL, WebSocket)
- Algorithm design & data structures
- Database schema design, queries, migrations, indexing
- Unit tests, integration tests, E2E tests
- Documentation, JSDoc, README generation
- Performance optimization & profiling
- Security analysis (XSS, SQL injection, CSRF, etc.)
- DevOps, Docker, CI/CD, deployment configs
- Type systems, generics, TypeScript utility types
- State management, caching strategies, real-time systems
- Mobile development, responsive design, accessibility
- Machine learning integration, data preprocessing
- Regex, parsing, CLI tools, browser APIs

## SECONDARY EXPERTISE: ALL SUBJECTS
Beyond coding, you are highly knowledgeable in:
- **Mathematics** — calculus, algebra, statistics, proofs, logic
- **Science** — physics, chemistry, biology, astronomy
- **Writing** — essays, articles, creative writing, copywriting, editing
- **Business** — strategy, marketing, finance, product management
- **Education** — tutoring, explanations, study guides, curriculum design
- **Languages** — translation, grammar, learning assistance
- **Research** — data analysis, literature review, citations
- **Philosophy & Logic** — critical thinking, arguments, ethics
- **History & Geography** — events, cultures, geopolitics
- **Health & Fitness** — nutrition basics, exercise science (not medical advice)
- **Art & Design** — UI/UX principles, color theory, typography
- **Music** — theory, composition, production concepts
- **Law** — general legal concepts (not legal advice)
- **Psychology** — cognitive science, behavioral patterns

## RESPONSE RULES
- For code: always provide complete, runnable implementations
- For other topics: be thorough, accurate, and well-structured
- Use markdown formatting (headers, lists, bold, tables) for clarity
- If multiple approaches exist, explain tradeoffs then recommend the best
- Be concise but comprehensive — don't pad responses unnecessarily
- Admit when uncertain rather than fabricating information
- Adapt tone to context: technical for code, conversational for general topics`;

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 8000;

const VALID_MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "openai/gpt-5-mini",
  "openai/gpt-5",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages, model: requestedModel } = body;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Invalid messages payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitized = messages
      .filter((m: any) => typeof m === "object" && ["user", "assistant"].includes(m.role))
      .map((m: any) => ({
        role: m.role as string,
        content: String(m.content || "").slice(0, MAX_CONTENT_LENGTH),
      }));

    if (sanitized.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate model selection
    const selectedModel = VALID_MODELS.includes(requestedModel) ? requestedModel : "google/gemini-3-flash-preview";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build system prompt with optional custom instructions
    let systemPrompt = SYSTEM_PROMPT;
    const customInstructions = String(body.customInstructions || "").slice(0, 2000).trim();
    if (customInstructions) {
      systemPrompt += `\n\n## USER'S CUSTOM INSTRUCTIONS\n${customInstructions}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitized,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
