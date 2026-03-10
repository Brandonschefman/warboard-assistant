<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>WarBoard Assistant</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #0d0f0a; height: 100%; overflow: hidden; }
    :root {
      --bg: #0d0f0a; --surface: #161a11; --border: #2e3828;
      --accent: #c8a84b; --accent2: #e05c2a; --blue: #3a7bd5; --green: #4caf50;
      --red: #e53935; --capital: #9c27b0; --text: #d4d9c8; --muted: #6b7560;
      --fh: 'Oswald', sans-serif; --fm: 'Share Tech Mono', monospace;
    }
    .app { font-family:var(--fm); color:var(--text); background:var(--bg); display:flex; flex-direction:column; width:100%; height:100vh; overflow:hidden; position:relative; }
    .scanlines { pointer-events:none; position:absolute; inset:0; z-index:9999; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px); }
    .header { display:flex; align-items:center; justify-content:space-between; padding:5px 10px; background:var(--surface); border-bottom:1px solid var(--border); flex-shrink:0; gap:6px; flex-wrap:wrap; }
    .htitle { font-family:var(--fh); font-size:17px; font-weight:700; letter-spacing:3px; color:var(--accent); text-transform:uppercase; }
    .hsub { font-size:8px; color:var(--muted); letter-spacing:2px; }
    .hstat { text-align:center; }
    .hval { font-family:var(--fh); font-size:16px; font-weight:700; color:var(--accent); line-height:1; }
    .hlbl { font-size:8px; color:var(--muted); letter-spacing:1px; }
    .nav { display:flex; background:var(--surface); border-bottom:1px solid var(--border); flex-shrink:0; }
    .nb { flex:1; padding:7px 4px; background:none; border:none; border-bottom:2px solid transparent; color:var(--muted); font-family:var(--fh); font-size:10px; letter-spacing:1px; cursor:pointer; text-transform:uppercase; transition:all 0.15s; }
    .nb.on { color:var(--accent); border-bottom-color:var(--accent); }
    .content { flex:1; overflow-y:auto; overflow-x:hidden; display:flex; gap:10px; padding:10px; flex-wrap:wrap; }
    .col { flex:1; min-width:260px; display:flex; flex-direction:column; gap:10px; }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:3px; padding:10px 12px; flex-shrink:0; }
    .card.cc { border-color:var(--capital); }
    .ctitle { font-family:var(--fh); font-size:11px; letter-spacing:2px; color:var(--accent); text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
    .ctitle::before { content:''; display:block; width:2px; height:12px; background:var(--accent); flex-shrink:0; }
    .card.cc .ctitle { color:var(--capital); }
    .card.cc .ctitle::before { background:var(--capital); }
    label { font-size:9px; letter-spacing:1px; color:var(--muted); text-transform:uppercase; display:block; margin-bottom:3px; }
    input[type=text],input[type=number] { width:100%; background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:var(--fm); font-size:13px; padding:5px 8px; border-radius:2px; outline:none; transition:border-color 0.15s; }
    input:focus { border-color:var(--accent); }
    .row { display:flex; gap:8px; margin-bottom:8px; align-items:flex-end; }
    .row > * { flex:1; }
    .btn { background:var(--accent); color:#0d0f0a; border:none; font-family:var(--fh); font-size:11px; letter-spacing:2px; padding:8px 12px; cursor:pointer; text-transform:uppercase; font-weight:600; border-radius:2px; transition:all 0.15s; white-space:nowrap; width:100%; }
    .btn:hover { opacity:0.88; } .btn:active { transform:scale(0.98); } .btn:disabled { opacity:0.35; cursor:not-allowed; }
    .red { background:var(--accent2); color:white; } .blue { background:var(--blue); color:white; }
    .bcap { background:var(--capital); color:white; } .grn { background:var(--green); color:#0d0f0a; }
    .sm { padding:5px 10px; font-size:9px; } .ghost { background:transparent; border:1px solid var(--border); color:var(--muted); }
    .rbox { background:var(--bg); border:1px solid var(--accent); border-radius:2px; padding:8px 10px; text-align:center; margin-top:8px; }
    .rnum { font-family:var(--fh); font-size:30px; color:var(--accent); font-weight:700; line-height:1; }
    .rlbl { font-size:9px; color:var(--muted); letter-spacing:2px; margin-top:2px; }
    .bdown { margin-top:5px; font-size:10px; color:var(--muted); line-height:1.8; }
    .bdown span { color:var(--text); }
    .dsel { display:flex; gap:4px; margin-bottom:8px; }
    .dopt { flex:1; padding:6px 4px; background:var(--bg); border:1px solid var(--border); border-radius:2px; color:var(--muted); font-family:var(--fh); font-size:14px; cursor:pointer; text-align:center; transition:all 0.15s; font-weight:700; }
    .dopt.da { background:rgba(224,92,42,0.2); border-color:var(--accent2); color:var(--accent2); }
    .dopt.dd { background:rgba(58,123,213,0.2); border-color:var(--blue); color:var(--blue); }
    .dopt.dc { background:rgba(156,39,176,0.2); border-color:var(--capital); color:var(--capital); }
    .bres { display:grid; grid-template-columns:1fr auto 1fr; gap:6px; align-items:center; margin-top:8px; }
    .side { text-align:center; padding:8px 6px; background:var(--bg); border:1px solid var(--border); border-radius:2px; }
    .side.sa { border-color:var(--accent2); } .side.sd { border-color:var(--blue); } .side.sc { border-color:var(--capital); }
    .slbl { font-size:8px; letter-spacing:2px; color:var(--muted); margin-bottom:2px; }
    .spct { font-family:var(--fh); font-size:24px; font-weight:700; }
    .sa .spct { color:var(--accent2); } .sd .spct { color:var(--blue); } .sc .spct { color:var(--capital); }
    .vs { font-family:var(--fh); font-weight:700; font-size:12px; color:var(--muted); text-align:center; }
    .drow { display:flex; gap:4px; justify-content:center; flex-wrap:wrap; margin-top:4px; }
    .die { width:28px; height:28px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-family:var(--fh); font-size:14px; font-weight:700; border:2px solid; }
    .die.da { background:rgba(224,92,42,0.15); border-color:var(--accent2); color:var(--accent2); }
    .die.dd { background:rgba(58,123,213,0.15); border-color:var(--blue); color:var(--blue); }
    .die.dc { background:rgba(156,39,176,0.15); border-color:var(--capital); color:var(--capital); }
    .olog { background:var(--bg); border:1px solid var(--border); padding:6px 8px; border-radius:2px; max-height:200px; overflow-y:auto; font-size:10px; color:var(--muted); margin-top:6px; }
    .lrnd { display:flex; align-items:center; gap:5px; padding:2px 0; border-bottom:1px solid rgba(46,56,40,0.4); }
    .lrnd:last-child { border-bottom:none; }
    .lrnum { font-family:var(--fh); font-size:9px; color:var(--muted); min-width:20px; }
    .ldice { display:flex; gap:2px; }
    .ldie { width:15px; height:15px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:8px; font-weight:700; border:1px solid; font-family:var(--fh); }
    .ldie.a { border-color:var(--accent2); color:var(--accent2); background:rgba(224,92,42,0.1); }
    .ldie.d { border-color:var(--blue); color:var(--blue); background:rgba(58,123,213,0.1); }
    .ldie.c { border-color:var(--capital); color:var(--capital); background:rgba(156,39,176,0.1); }
    .lhdr { font-family:var(--fh); font-size:9px; color:var(--muted); padding:2px 0 4px; border-bottom:1px solid var(--border); margin​​​​​​​​​​​​​​​​
