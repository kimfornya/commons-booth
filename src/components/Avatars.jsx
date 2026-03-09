const avatars = [
  { name: "dom", img: "/avatars/dom.png" },
  { name: "daryl 2", img: "/avatars/daryl.png" },
  { name: "barry 3", img: "/avatars/barry.png" },
  { name: "patrick 4", img: "/avatars/patrick.png" },
  { name: "jesse 5", img: "/avatars/jesse.png" },
  { name: "colin 6", img: "/avatars/colin.png" },
  { name: "kim 7", img: "/avatars/kim.png" }
];

export default function Avatars() {
  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        justifyContent: "center",
        padding: "12px"
      }}
    >
      {avatars.map((a, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <img
            src={a.img}
            alt={a.name}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "2px solid white"
            }}
          />
          <div style={{ color: "white", fontSize: "12px" }}>{a.name}</div>
        </div>
      ))}
    </div>
  );
}
