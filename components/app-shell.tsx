import Link from "next/link";
import { Icon } from "./icons";

const nav = [
  ["/", "home", "今日学习"],
  ["/courses", "book", "教材课程"],
  ["/vocabulary", "words", "单词本"],
  ["/mistakes", "mistakes", "错题本"],
  ["/progress", "progress", "学习进度"],
  ["/search", "search", "教材搜索"],
];

export function AppShell({ children, active }: { children: React.ReactNode; active: string }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark">f.</span><span><strong>Le Français</strong><small>我的法语学习空间</small></span></Link>
      <nav>{nav.map(([href, icon, label]) => <Link key={href} href={href} className={active === href ? "active" : ""}><Icon name={icon} /><span>{label}</span>{active === href && <i />}</Link>)}</nav>
      <div className="sidebar-bottom">
      <div className="level-card"><div><span>教材索引</span><strong>2 课</strong></div><div className="mini-progress"><i style={{ width: "5%" }} /></div><small>已核对 Leçon 1–2</small></div>
        <Link href="/progress" className="profile"><span>学</span><span><strong>本地学习者</strong><small>本浏览器持久化</small></span><Icon name="chevron" /></Link>
      </div>
    </aside>
    <main className="main"><header className="topbar"><div className="mobile-brand"><span className="brand-mark">f.</span><strong>Le Français</strong></div><div className="top-actions"><Link href="/search" aria-label="搜索教材"><Icon name="search" /></Link><span className="streak"><Icon name="book" /> 已核对 2 课</span><button className="avatar">学</button></div></header>{children}</main>
  </div>;
}
