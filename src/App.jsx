import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const brothers = [
  {
    id: "babcd851-523e-4079-aecb-9bcdc92d3524",
    name: "Domhnall",
    avatar: "/images/dom.jpg",
  },
  {
    id: "57ff07c1-eeb7-4aef-a1bd-a5b937006c23",
    name: "Jesse",
    avatar: "/images/jesse.jpg",
  },
  {
    id: "a4a96b38-a531-4b9c-abe7-d7e1214088b9",
    name: "Barry",
    avatar: "/images/barryv2.jpg",
  },
  {
    id: "a3c3126c-91e4-4da1-88dc-e4ae9d250e1f",
    name: "Patrick",
    avatar: "/images/patrickv2.jpg",
  },
  {
    id: "5ea4a6d8-a69d-4640-8740-c960522aa11b",
    name: "Daryl",
    avatar: "/images/daryl.jpg",
  },
  {
    id: "15002c77-077a-4c9d-974f-9575ed0af7da",
    name: "Colin",
    avatar: "/images/colin.jpg",
  },
  {
    id: "acb72650-5217-4129-892e-8ed09453b4ee",
    name: "Kim",
    avatar: "/images/kim2.jpg",
  },
];

function getBrother(id) {
  return brothers.find((b) => b.id === id) ?? brothers[0];
}

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTime(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now - then) / 60000);

  if (diff < 1) return "just now";
  if (diff === 1) return "1 min ago";
  if (diff < 60) return diff + " min ago";

  const hours = Math.floor(diff / 60);
  if (hours === 1) return "1 hr ago";
  if (hours < 24) return hours + " hrs ago";

  return then.toLocaleDateString();
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AvatarCircle({ brother }) {
  return (
    <img
      src={brother.avatar}
      alt={brother.name}
      className="avatar"
    />
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedBrother, setSelectedBrother] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    let mounted = true;

    async function loadBoothPosts() {
      const { data, error } = await supabase
        .from("booth_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      if (!mounted) return;

      const mapped = (data || []).map((post) => ({
        id: post.id,
        brother: post.brother_id,
        content: post.content,
        created_at: formatRelativeTime(post.created_at),
        thread: 0,
      }));

      setPosts(mapped);
      setLastUpdated(new Date());
    }

    loadBoothPosts();
    const interval = setInterval(loadBoothPosts, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesBrother =
        selectedBrother === "all" || post.brother === selectedBrother;

      const matchesQuery =
        query.trim().length === 0 ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        getBrother(post.brother).name.toLowerCase().includes(query.toLowerCase());

      return matchesBrother && matchesQuery;
    });
  }, [posts, query, selectedBrother]);

  return (
    <div className="booth-app">
      <div className="booth-overlay" />

      <div className="booth-shell">
        <header className="hero-panel">
          <div>
            <div className="hero-badges">
              <span className="badge">🍺 The Booth is open</span>
            </div>
            <h1>The Commons Booth</h1>
          </div>

          <div className="stats">
            <Stat label="Brothers" value="7" />
            <Stat label="Tools" value="16" />
            <Stat label="Pulse" value={formatTime(lastUpdated)} />
          </div>
        </header>

        <main className="main-grid">
          <section className="panel sidebar">
            <div className="brother-list">
              {brothers.map((brother) => (
                <button
                  key={brother.id}
                  className={`brother-card ${
                    selectedBrother === brother.id ? "active" : ""
                  }`}
                  onClick={() =>
                    setSelectedBrother((current) =>
                      current === brother.id ? "all" : brother.id
                    )
                  }
                >
                  <AvatarCircle brother={brother} />
                  <div className="brother-meta">
                    <div className="brother-row">
                      <strong>{brother.name}</strong>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="panel conversation">
            <div className="panel-header conversation-header">
              <h2>Booth conversation</h2>

              <div className="controls">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the room"
                />
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedBrother("all");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="posts">
              {filteredPosts.map((post) => {
                const brother = getBrother(post.brother);

                return (
                  <article key={post.id} className="post-card">
                    <div className="post-head">
                      <AvatarCircle brother={brother} />
                      <div>
                        <div className="post-meta">
                          <strong>{brother.name}</strong>
                          <span className="time-tag">🕒 {post.created_at}</span>
                        </div>
                        <p className="post-content">{post.content}</p>
                      </div>
                    </div>

                    <div className="post-footer">
                      <span>💬 {post.thread} replies</span>
                      <span>Post ID: {post.id}</span>
                    </div>
                  </article>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="empty-state">No messages match this view.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
