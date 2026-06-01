import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import "./App.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const [review, setReview] = useState(``);

  async function reviewCode() {
    if (!code.trim()) {
      toast.error("Please enter some code");
      return;
    }

    const toastId = toast.loading("Analyzing your code... 🧠");
    setLoading(true);

    try {
      // const response = await axios.post(
      //   "http://localhost:5000/api/ai/get-review",
      //   { code }
      // );

      const response = await axios.post(
        "https://code-reviewer-vubr.onrender.com/api/ai/get-review",
        { code }
      );

      setReview(response.data);
      toast.success("Review completed ✅", { id: toastId });
    } catch (error) {
      toast.error("Failed to analyze code ❌", { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster/>
      <header className="fixed w-full  bg-linear-to-r text-2xl font-bold text-white from-blue-500 to-purple-700 py-3 text-center">
        Code Reviewer
      </header>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-6">
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* LEFT: Code Editor */}
          <div className="flex flex-col rounded-xl border border-white/10 bg-gray-900 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="font-semibold text-sm tracking-wide text-gray-300">
                Code Editor
              </h2>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md border border-white/10"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="typescript">TypeScript</option>
              </select>

              <button
                onClick={reviewCode}
                disabled={loading}
                className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer
                          bg-gradient-to-r from-indigo-500 to-purple-600
                          hover:opacity-90 transition
                          disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? "Analyzing..." : "Review"}
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 p-3 overflow-auto">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  prism.highlight(
                    code,
                    prism.languages[language] || prism.languages.javascript,
                    language
                  )
                }
                padding={12}
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 15,
                  backgroundColor: "transparent",
                  outline: "none",
                  minHeight: "100%",
                }}
              />
            </div>
          </div>

          {/* RIGHT: AI Review */}
          <div className="rounded-xl border border-white/10 bg-gray-900 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <h2 className="font-semibold text-sm tracking-wide text-gray-300">
                AI Review
              </h2>
            </div>

            {/* Markdown Output */}
            <div className="p-4 max-h-[75vh] overflow-y-auto prose prose-invert max-w-none">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review || "✨ Your AI code review will appear here."}
              </Markdown>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
