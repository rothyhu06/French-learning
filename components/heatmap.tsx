const levels = [0,0,1,2,0,0,0, 1,3,2,0,1,0,0, 2,4,3,1,0,0,0, 0,2,4,3,2,0,0, 1,3,2,4,1,0,0, 0,0,2,3,2,0,0, 0,1,3,4,3,1,0, 0,0,2,3,4,2,0, 1,2,4,3,2,0,0, 0,0,2,4,3,1,0, 0,1,3,2,4,2,0, 0,0,1,3,2,0,0];
export function Heatmap() { return <div className="heatmap" aria-label="过去十二周学习热力图">{levels.map((v, i) => <i key={i} data-level={v} />)}</div>; }
