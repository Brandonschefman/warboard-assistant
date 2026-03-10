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
    .lhdr { font-family:var(--fh); font-size:9px; color:var(--muted); padding:2px 0 4px; border-bottom:1px solid var(--border); margin-bottom:2px; display:flex; justify-content:space-between; }
    .lsum { margin-top:6px; padding-top:6px; border-top:1px solid var(--border); font-family:var(--fh); font-size:10px; display:flex; justify-content:space-between; }
    .igrid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
    .icell { background:var(--bg); border:1px solid var(--border); padding:8px; border-radius:2px; text-align:center; }
    .ival { font-family:var(--fh); font-size:20px; font-weight:700; color:var(--accent); }
    .ilbl { font-size:8px; color:var(--muted); letter-spacing:1px; margin-top:2px; }
    .sdiv { height:1px; background:var(--border); margin:8px 0; }
    .tag { display:inline-block; border:1px solid var(--border); border-radius:2px; padding:2px 8px; font-size:9px; color:var(--muted); }
    .tag.g { border-color:var(--green); color:var(--green); } .tag.r { border-color:var(--red); color:var(--red); } .tag.o { border-color:var(--accent); color:var(--accent); }
    .prog { height:3px; background:var(--border); border-radius:2px; margin-top:6px; overflow:hidden; }
    .pfill { height:100%; background:linear-gradient(90deg,var(--accent2),var(--accent)); transition:width 0.4s; }
    .crow { display:flex; gap:6px; align-items:center; margin-bottom:6px; }
    .delbtn { background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; padding:3px 5px; }
    .delbtn:hover { color:var(--red); }
    input[type=range] { width:100%; accent-color:var(--accent); }
    .cbadge { display:inline-flex; align-items:center; background:rgba(156,39,176,0.15); border:1px solid var(--capital); border-radius:2px; padding:1px 7px; font-size:9px; color:var(--capital); letter-spacing:1px; font-family:var(--fh); }
    .modebtn { background:transparent; border:1px solid var(--border); border-radius:3px; color:var(--muted); cursor:pointer; padding:3px 8px; font-family:var(--fh); font-size:9px; letter-spacing:1px; transition:all 0.2s; white-space:nowrap; }
    .modebtn.on { background:rgba(156,39,176,0.15); border-color:var(--capital); color:var(--capital); }
    .outrow { display:flex; gap:6px; margin-top:8px; }
    .outrow .btn { flex:1; }
    @keyframes fw { 0%,100%{background:var(--bg)} 50%{background:rgba(76,175,80,0.12)} }
    @keyframes fl { 0%,100%{background:var(--bg)} 50%{background:rgba(229,57,53,0.12)} }
    .fw { animation:fw 0.5s ease; } .fl { animation:fl 0.5s ease; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React;
    const rollDie = () => Math.floor(Math.random() * 6) + 1;
    function doRound(ad, dd) {
      const a = Array.from({length:ad}, rollDie).sort((x,y)=>y-x);
      const d = Array.from({length:dd}, rollDie).sort((x,y)=>y-x);
      let aL=0, dL=0;
      for (let i=0; i<Math.min(ad,dd); i++) { if(a[i]>d[i]) dL++; else aL++; }
      return {ad:a, dd:d, aLoss:aL, dLoss:dL};
    }
    function simulate(atk, def, adMax, ddMax, n) {
      let w=0;
      for (let s=0; s<n; s++) {
        let a=atk, d=def;
        while(a>1&&d>0){const r=doRound(Math.min(adMax,a-1),Math.min(ddMax,d));a-=r.aLoss;d-=r.dLoss;}
        if(d===0) w++;
      }
      return Math.round((w/n)*100);
    }
    const DEF_CONTS = [
      {id:1,name:"Europa",territories:7,bonus:5},{id:2,name:"Noord-Amerika",territories:9,bonus:5},
      {id:3,name:"Zuid-Amerika",territories:4,bonus:2},{id:4,name:"Afrika",territories:6,bonus:3},
      {id:5,name:"Azië",territories:12,bonus:7},{id:6,name:"Oceanië",territories:4,bonus:2},
    ];
    function App() {
      const [tab, setTab] = useState("calc");
      const [myTerr, setMyTerr] = useState(12);
      const [myCaps, setMyCaps] = useState(0);
      const [totalCaps, setTotalCaps] = useState(4);
      const [capsMode, setCapsMode] = useState(true);
      const [flash, setFlash] = useState("");
      const [locked, setLocked] = useState(false);
      const applyFlash = (t) => { setFlash(t); setTimeout(()=>setFlash(""),600); };
      const gainTerr = () => { setMyTerr(t=>t+1); applyFlash("w"); };
      const loseTerr = () => { setMyTerr(t=>Math.max(1,t-1)); applyFlash("l"); };
      const gainCap = () => { setMyCaps(c=>Math.min(c+1,totalCaps)); applyFlash("w"); };
      const loseCap = () => { setMyCaps(c=>Math.max(0,c-1)); applyFlash("l"); };
      const hasWon = capsMode && myCaps >= totalCaps && totalCaps > 0;
      const [conts, setConts] = useState(DEF_CONTS);
      const [newCont, setNewCont] = useState({name:"",bonus:""});
      const [ownedConts, setOwnedConts] = useState([]);
      const toggleCont = (id) => setOwnedConts(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
      const baseR = Math.max(3, Math.floor(myTerr/3));
      const contBonus = ownedConts.reduce((s,id)=>s+(conts.find(c=>c.id===id)?.bonus||0),0);
      const capBonus = capsMode ? myCaps*2 : 0;
      const totalR = baseR + contBonus + capBonus;
      const [atkT, setAtkT] = useState(10);
      const [defT, setDefT] = useState(5);
      const [atkDice, setAtkDice] = useState(3);
      const [defDice, setDefDice] = useState(2);
      const [isCap, setIsCap] = useState(false);
      const [simRes, setSimRes] = useState(null);
      const [liveR, setLiveR] = useState(null);
      const [bLog, setBLog] = useState([]);
      const [simN, setSimN] = useState(1000);
      const [atkRem, setAtkRem] = useState(null);
      const [defRem, setDefRem] = useState(null);
      const [rnd, setRnd] = useState(0);
      const effDef = isCap ? 3 : defDice;
      const battleOver = atkRem !== null && (atkRem <= 1 || defRem <= 0);
      const runSim = () => setSimRes(simulate(Number(atkT),Number(defT),atkDice,effDef,Number(simN)));
      const startBattle = () => { setAtkRem(Number(atkT)); setDefRem(Number(defT)); setRnd(0); setBLog([]); setLiveR(null); setSimRes(null); };
      const rollRound = () => {
        const ca=atkRem!==null?atkRem:Number(atkT), cd=defRem!==null?defRem:Number(defT);
        const r=doRound(Math.min(atkDice,ca-1),Math.min(effDef,cd));
        const na=Math.max(0,ca-r.aLoss), nd=Math.max(0,cd-r.dLoss), nr=rnd+1;
        setLiveR(r); setAtkRem(na); setDefRem(nd); setRnd(nr);
        setBLog(p=>[...p,{round:nr,ad:r.ad,dd:r.dd,aLoss:r.aLoss,dLoss:r.dLoss,atkAfter:na,defAfter:nd,cap:isCap}]);
      };
      const autoFinish = () => {
        let ca=atkRem!==null?atkRem:Number(atkT), cd=defRem!==null?defRem:Number(defT), cr=rnd;
        const entries=[];
        while(ca>1&&cd>0){
          const r=doRound(Math.min(atkDice,ca-1),Math.min(effDef,cd));
          ca=Math.max(0,ca-r.aLoss); cd=Math.max(0,cd-r.dLoss); cr++;
          entries.push({round:cr,ad:r.ad,dd:r.dd,aLoss:r.aLoss,dLoss:r.dLoss,atkAfter:ca,defAfter:cd,cap:isCap});
        }
        setBLog(p=>[...p,...entries]); setAtkRem(ca); setDefRem(cd); setRnd(cr);
        if(entries.length>0){const l=entries[entries.length-1]; setLiveR({ad:l.ad,dd:l.dd,aLoss:l.aLoss,dLoss:l.dLoss});}
      };
      const battleWon = () => { gainTerr(); setTab("calc"); };
      const battleLost = () => { loseTerr(); setTab("calc"); };
      const addCont = () => {
        if(!newCont.name) return;
        setConts(p=>[...p,{id:Date.now(),name:newCont.name,territories:0,bonus:Number(newCont.bonus)||0}]);
        setNewCont({name:"",bonus:""});
      };
      const delCont = (id) => { setConts(p=>p.filter(c=>c.id!==id)); setOwnedConts(p=>p.filter(x=>x!==id)); };

      return (
        <div className={`app ${flash==='w'?'fw':flash==='l'?'fl':''}`}>
          <div className="scanlines"/>
          {locked && (
            <div onClick={()=>setLocked(false)} style={{position:'absolute',inset:0,zIndex:800,background:'rgba(13,15,10,0.97)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,cursor:'pointer'}}>
              <div style={{fontSize:52}}>🔒</div>
              <div style={{fontFamily:'var(--fh)',fontSize:20,fontWeight:700,color:'var(--muted)',letterSpacing:4}}>VERGRENDELD</div>
              <div style={{fontSize:10,color:'var(--muted)',letterSpacing:2}}>TIK ERGENS OM TE ONTGRENDELEN</div>
              <div style={{marginTop:12,display:'flex',gap:20,fontSize:11,color:'var(--muted)',fontFamily:'var(--fh)',flexWrap:'wrap',justifyContent:'center'}}>
                <span>🎖 {myTerr} gebieden</span>
                {capsMode && <span style={{color:'var(--capital)'}}>👑 {myCaps}/{totalCaps} capitals</span>}
                <span style={{color:'var(--accent)'}}>+{totalR} troepen/beurt</span>
              </div>
            </div>
          )}
          {hasWon && (
            <div style={{position:'absolute',inset:0,zIndex:600,background:'rgba(13,15,10,0.96)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
              <div style={{fontSize:64}}>👑</div>
              <div style={{fontFamily:'var(--fh)',fontSize:32,fontWeight:700,color:'var(--accent)',letterSpacing:4,textAlign:'center'}}>OVERWINNING!</div>
              <div style={{fontSize:12,color:'var(--muted)',letterSpacing:2}}>Alle {totalCaps} capitals veroverd</div>
              <button className="btn" style={{width:'auto',padding:'10px 30px',marginTop:8}} onClick={()=>{setMyCaps(0);setMyTerr(12);}}>↺ NIEUW SPEL</button>
            </div>
          )}
          <div className="header">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div><div className="htitle">⚔ WarBoard</div><div className="hsub">TACTISCHE ASSISTENT v3.0</div></div>
              <button onClick={()=>setLocked(true)} style={{background:'transparent',border:'1px solid var(--border)',borderRadius:3,color:'var(--muted)',cursor:'pointer',padding:'4px 8px',fontSize:14,lineHeight:1}}>🔒</button>
              <button className={`modebtn ${capsMode?'on':''}`} onClick={()=>setCapsMode(m=>!m)}>{capsMode?'👑 CAPITALS AAN':'⚔ NORMAAL RISK'}</button>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
              <div style={{display:'flex',gap:5,alignItems:'center'}}>
                <button className="btn red sm" style={{width:'auto',padding:'4px 9px'}} onClick={loseTerr}>−</button>
                <div className="hstat"><div className="hval">{myTerr}</div><div className="hlbl">GEBIEDEN</div></div>
                <button className="btn grn sm" style={{width:'auto',padding:'4px 9px'}} onClick={gainTerr}>+</button>
              </div>
              {capsMode && <>
                <div style={{width:1,height:28,background:'var(--border)'}}/>
                <div style={{display:'flex',gap:5,alignItems:'center'}}>
                  <button className="btn sm" style={{width:'auto',padding:'4px 9px',background:'transparent',border:'1px solid var(--capital)',color:'var(--capital)'}} onClick={loseCap}>−</button>
                  <div className="hstat"><div className="hval" style={{color:'var(--capital)'}}>{myCaps}<span style={{fontSize:10,color:'var(--muted)'}}>/{totalCaps}</span></div><div className="hlbl">👑 CAPITALS</div></div>
                  <button className="btn bcap sm" style={{width:'auto',padding:'4px 9px'}} onClick={gainCap}>+</button>
                </div>
              </>}
              <div style={{width:1,height:28,background:'var(--border)'}}/>
              <div className="hstat"><div className="hval">{totalR}</div><div className="hlbl">TROEPEN/BEURT</div></div>
            </div>
          </div>
          <div className="nav">
            {[{id:"calc",label:"🎖 Troepen"},{id:"battle",label:"⚔ Gevecht"},{id:"map",label:"🗺 Kaart"}].map(t=>(
              <button key={t.id} className={`nb${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          {tab==="calc" && (
            <div className="content">
              <div className="col">
                <div className="card">
                  <div className="ctitle">Gebieden Teller</div>
                  <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:8}}>
                    <button className="btn red" style={{width:38,padding:'6px 0'}} onClick={loseTerr}>−</button>
                    <input type="number" min="1" value={myTerr} onChange={e=>setMyTerr(Number(e.target.value)||1)} style={{textAlign:'center',fontSize:22,fontFamily:'var(--fh)',fontWeight:700}}/>
                    <button className="btn grn" style={{width:38,padding:'6px 0'}} onClick={gainTerr}>+</button>
                  </div>
                  <div className="rbox">
                    <div className="rnum">{totalR}</div>
                    <div className="rlbl">VERSTERKINGEN DEZE BEURT</div>
                    <div className="bdown">Basis: <span>{myTerr} ÷ 3 = {baseR}</span><br/>Continent: <span>+{contBonus}</span>{capsMode && <> &nbsp;|&nbsp; Capitals: <span style={{color:'var(--capital)'}}>+{capBonus}</span></>}</div>
                    <div className="prog"><div className="pfill" style={{width:`${Math.min(100,(totalR/45)*100)}%`}}/></div>
                  </div>
                </div>
                {capsMode && (
                  <div className="card cc">
                    <div className="ctitle">👑 Capitals</div>
                    <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:10}}>
                      <button className="btn sm" style={{width:38,padding:'6px 0',background:'transparent',border:'1px solid var(--capital)',color:'var(--capital)'}} onClick={loseCap}>−</button>
                      <div style={{flex:1,textAlign:'center'}}>
                        <div style={{fontFamily:'var(--fh)',fontSize:28,fontWeight:700,color:'var(--capital)',lineHeight:1}}>{myCaps}<span style={{fontSize:16,color:'var(--muted)'}}>/{totalCaps}</span></div>
                        <div style={{fontSize:9,color:'var(--muted)',letterSpacing:1,marginTop:2}}>VEROVERD</div>
                      </div>
                      <button className="btn bcap sm" style={{width:38,padding:'6px 0'}} onClick={gainCap}>+</button>
                    </div>
                    <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:10}}>
                      {Array.from({length:totalCaps}).map((_,i)=>(
                        <div key={i} onClick={()=>setMyCaps(i<myCaps?i:i+1)} style={{width:28,height:28,borderRadius:'50%',cursor:'pointer',transition:'all 0.2s',background:i<myCaps?'var(--capital)':'var(--bg)',border:`2px solid ${i<myCaps?'var(--capital)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{i<myCaps?'👑':''}</div>
                      ))}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontSize:10,color:'var(--muted)'}}>+2 troepen per capital</div>
                      <div style={{fontFamily:'var(--fh)',fontSize:11,color:'var(--capital)'}}>BONUS: +{capBonus}</div>
                    </div>
                    <div className="sdiv"/>
                    <div style={{display:'flex',gap:6,alignItems:'center'}}>
                      <div style={{fontSize:9,color:'var(--muted)',whiteSpace:'nowrap'}}>CAPITALS IN SPEL:</div>
                      <div style={{display:'flex',gap:4}}>
                        {[2,3,4,5,6].map(n=>(
                          <div key={n} onClick={()=>{setTotalCaps(n);setMyCaps(c=>Math.min(c,n));}} style={{width:22,height:22,borderRadius:2,cursor:'pointer',background:totalCaps===n?'var(--capital)':'var(--bg)',border:`1px solid ${totalCaps===n?'var(--capital)':'var(--border)'}`,color:totalCaps===n?'white':'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--fh)',fontSize:11,fontWeight:700,transition:'all 0.15s'}}>{n}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col">
                <div className="card">
                  <div className="ctitle">Continent Bonus</div>
                  {conts.map(c=>(
                    <div key={c.id} style={{marginBottom:5}}>
                      <button onClick={()=>toggleCont(c.id)} style={{width:'100%',textAlign:'left',cursor:'pointer',transition:'all 0.15s',background:ownedConts.includes(c.id)?'rgba(200,168,75,0.1)':'var(--bg)',border:`1px solid ${ownedConts.includes(c.id)?'var(--accent)':'var(--border)'}`,color:ownedConts.includes(c.id)?'var(--accent)':'var(--muted)',padding:'6px 10px',borderRadius:2,fontFamily:'var(--fm)',fontSize:11,display:'flex',justifyContent:'space-between'}}>
                        <span>{ownedConts.includes(c.id)?'✓ ':''}{c.name}</span>
                        <span style={{fontSize:9,opacity:0.7}}>+{c.bonus} bonus</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab==="battle" && (
            <div className="content">
              <div className="col">
                <div className={`card ${isCap?'cc':''}`}>
                  <div className="ctitle">{isCap?'👑 Kapitaal Aanval':'Gevecht Instellingen'}</div>
                  <div style={{display:'flex',gap:6,marginBottom:8}}>
                    <button style={{flex:1,padding:'5px',background:!isCap?'var(--accent)':'transparent',border:`1px solid ${!isCap?'var(--accent)':'var(--border)'}`,color:!isCap?'#0d0f0a':'var(--muted)',borderRadius:2,fontFamily:'var(--fh)',fontSize:10,cursor:'pointer'}} onClick={()=>setIsCap(false)}>NORMAAL</button>
                    <button style={{flex:1,padding:'5px',background:isCap?'var(--capital)':'transparent',border:`1px solid ${isCap?'var(--capital)':'var(--border)'}`,color:isCap?'white':'var(--muted)',borderRadius:2,fontFamily:'var(--fh)',fontSize:10,cursor:'pointer'}} onClick={()=>setIsCap(true)}>👑 KAPITAAL</button>
                  </div>
                  {isCap && <div style={{background:'rgba(156,39,176,0.1)',border:'1px solid var(--capital)',borderRadius:2,padding:'5px 10px',marginBottom:8,fontSize:9,color:'var(--capital)'}}>KAPITAAL: Verdediger gooit altijd 3 dobbelstenen</div>}
                  <div className="row">
                    <div><label>⚔ Aanvaller troepen</label><input type="number" min="2" value={atkT} onChange={e=>setAtkT(e.target.value)}/></div>
                    <div><label>🛡 Verdediger troepen</label><input type="number" min="1" value={defT} onChange={e=>setDefT(e.target.value)}/></div>
                  </div>
                  <label style={{marginBottom:4}}>⚔ Aanvaller dobbelstenen</label>
                  <div className="dsel">{[1,2,3].map(n=><div key={n} className={`dopt ${atkDice===n?'da':''}`} onClick={()=>setAtkDice(n)}>{n}</div>)}</div>
                  <label style={{marginBottom:4}}>🛡 Verdediger dobbelstenen {isCap&&<span className="cbadge">👑 VAST: 3</span>}</label>
                  <div className="dsel" style={{opacity:isCap?0.35:1,pointerEvents:isCap?'none':'auto'}}>{[1,2,3].map(n=><div key={n} className={`dopt ${effDef===n?(isCap?'dc':'dd'):''}`} onClick={()=>setDefDice(n)}>{n}</div>)}</div>
                  <label style={{marginTop:8}}>Simulaties: {simN}</label>
                  <input type="range" min="100" max="5000" step="100" value={simN} onChange={e=>setSimN(e.target.value)} style={{marginBottom:8}}/>
                  <div className="row" style={{marginBottom:4}}>
                    <button className="btn" onClick={runSim}>Simuleer</button>
                    <button className={`btn ${isCap?'bcap':'red'}`} onClick={rollRound} disabled={battleOver}>Gooi Dobbelstenen</button>
                  </div>
                  <button className="btn blue" style={{marginBottom:4}} onClick={autoFinish} disabled={battleOver}>⚡ GEVECHT AFMAKEN</button>
                  <button className="btn ghost" style={{fontSize:9,padding:'5px'}} onClick={startBattle}>↺ NIEUW GEVECHT STARTEN</button>
                </div>
                {simRes !== null && (
                  <div className="card">
                    <div className="bres">
                      <div className="side sa"><div className="slbl">AANVALLER</div><div className="spct">{simRes}%</div></div>
                      <div className="vs">VS</div>
                      <div className={`side ${isCap?'sc':'sd'}`}><div className="slbl">{isCap?'👑 KAPITAAL':'VERDEDIGER'}</div><div className="spct">{100-simRes}%</div></div>
                    </div>
                    <div style={{textAlign:'center',marginTop:6}}>
                      <span className={`tag ${simRes>=60?'g':simRes>=40?'o':'r'}`}>{simRes>=60?'✓ AANRADEN':simRes>=40?'⚠ TWIJFELACHTIG':'✗ RISKANT'}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="col">
                {liveR && (
                  <div className={`card ${isCap?'cc':''}`}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div className="ctitle" style={{marginBottom:0}}>Ronde {rnd}</div>
                      <div style={{fontSize:9,color:'var(--muted)',fontFamily:'var(--fh)'}}>Overig: <span style={{color:'var(--accent2)'}}>{atkRem}⚔</span> <span style={{color:isCap?'var(--capital)':'var(--blue)'}}>{defRem}🛡</span></div>
                    </div>
                    <div style={{display:'flex',gap:12,justifyContent:'center',alignItems:'center'}}>
                      <div style={{textAlign:'center'}}><div style={{fontSize:9,color:'var(--muted)',marginBottom:4}}>AANVALLER</div><div className="drow">{liveR.ad.map((d,i)=><div key={i} className="die da">{d}</div>)}</div></div>
                      <div style={{fontFamily:'var(--fh)',fontSize:11,color:'var(--muted)'}}>VS</div>
                      <div style={{textAlign:'center'}}><div style={{fontSize:9,color:isCap?'var(--capital)':'var(--muted)',marginBottom:4}}>{isCap?'👑 KAPITAAL':'VERDEDIGER'}</div><div className="drow">{liveR.dd.map((d,i)=><div key={i} className={`die ${isCap?'dc':'dd'}`}>{d}</div>)}</div></div>
                    </div>
                    <div style={{textAlign:'center',marginTop:8,fontSize:11,color:'var(--muted)'}}>Aanvaller verliest <span style={{color:'var(--accent2)',fontWeight:'bold'}}>{liveR.aLoss}</span> &nbsp;|&nbsp; Verdediger verliest <span style={{color:'var(--green)',fontWeight:'bold'}}>{liveR.dLoss}</span></div>
                  </div>
                )}
                <div className="card">
                  <div className="ctitle">Gevecht Uitkomst</div>
                  <div style={{fontSize:10,color:'var(--muted)',marginBottom:6,lineHeight:1.6}}>Registreer het resultaat — gebiedsteller past automatisch aan:</div>
                  <div className="outrow">
                    <button className="btn grn" onClick={battleWon}>✓ Gewonnen<br/><span style={{fontSize:9,fontWeight:400}}>+1 gebied</span></button>
                    <button className="btn red" onClick={battleLost}>✗ Verloren<br/><span style={{fontSize:9,fontWeight:400}}>−1 gebied</span></button>
                  </div>
                  <div style={{marginTop:8,textAlign:'center',fontSize:11,fontFamily:'var(--fh)',color:'var(--muted)'}}>NU: <span style={{color:'var(--accent)',fontSize:15}}>{myTerr}</span> &nbsp;→&nbsp; <span style={{color:'var(--green)'}}>{myTerr+1}</span> of <span style={{color:'var(--red)'}}>{Math.max(1,myTerr-1)}</span></div>
                </div>
                {bLog.length > 0 && (
                  <div className="card">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div className="ctitle" style={{marginBottom:0}}>Gevecht Log</div>
                      <div style={{fontSize:10,fontFamily:'var(--fh)',display:'flex',gap:8}}><span style={{color:'var(--accent2)'}}>ATK:{atkRem??Number(atkT)}</span><span style={{color:isCap?'var(--capital)':'var(--blue)'}}>DEF:{defRem??Number(defT)}</span></div>
                    </div>
                    <div className="olog">
                      <div className="lhdr"><span>RND · AANVALLER · VERDEDIGER</span><span>VERLIES</span></div>
                      {bLog.map((e,i)=>(
                        <div key={i} className="lrnd">
                          <span className="lrnum">R{e.round}</span>
                          <div className="ldice">{e.ad.map((d,j)=><div key={j} className="ldie a">{d}</div>)}</div>
                          <span style={{fontSize:9,color:'var(--muted)'}}>vs</span>
                          <div className="ldice">{e.dd.map((d,j)=><div key={j} className={`ldie ${e.cap?'c':'d'}`}>{d}</div>)}</div>
                          <span style={{flex:1}}/>
                          <span style={{fontSize:9,fontFamily:'var(--fh)'}}>
                            {e.aLoss>0&&<span style={{color:'var(--accent2)'}}>−{e.aLoss}⚔</span>}
                            {e.dLoss>0&&<span style={{color:e.cap?'var(--capital)':'var(--blue)'}}>−{e.dLoss}🛡</span>}
                            {e.aLoss===0&&e.dLoss===0&&<span style={{color:'var(--muted)'}}>—</span>}
                          </span>
                          <span style={{fontSize:9,color:'var(--muted)',minWidth:52,textAlign:'right'}}>{e.atkAfter}⚔{e.defAfter}🛡</span>
                        </div>
                      ))}
                      {(()=>{const tA=bLog.reduce((s,e)=>s+e.aLoss,0),tD=bLog.reduce((s,e)=>s+e.dLoss,0),last=bLog[bLog.length-1],over=last.atkAfter<=1||last.defAfter<=0;return(<div className="lsum"><span style={{color:'var(--muted)'}}>{bLog.length} rondes</span><span><span style={{color:'var(--accent2)'}}>ATK −{tA}</span><span style={{color:'var(--muted)'}}> | </span><span style={{color:isCap?'var(--capital)':'var(--blue)'}}>DEF −{tD}</span></span>{over&&<span style={{color:last.defAfter<=0?'var(--green)':'var(--red)',fontWeight:'bold'}}>{last.defAfter<=0?'✓ GEWONNEN':'✗ GESTOPT'}</span>}</div>);})()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {tab==="map" && (
            <div className="content">
              <div className="col">
                <div className="card">
                  <div className="ctitle">Continent Beheer</div>
                  {conts.map(c=>(
                    <div key={c.id} className="crow">
                      <input type="text" value={c.name} style={{flex:2}} onChange={e=>setConts(p=>p.map(x=>x.id===c.id?{...x,name:e.target.value}:x))}/>
                      <input type="number" value={c.bonus} style={{flex:1}} onChange={e=>setConts(p=>p.map(x=>x.id===c.id?{...x,bonus:Number(e.target.value)}:x))}/>
                      <button className="delbtn" onClick={()=>delCont(c.id)}>✕</button>
                    </div>
                  ))}
                  <div className="sdiv"/>
                  <div style={{fontSize:9,color:'var(--muted)',marginBottom:6}}>NIEUW CONTINENT</div>
                  <div className="crow">
                    <input type="text" placeholder="Naam" value={newCont.name} style={{flex:2}} onChange={e=>setNewCont(p=>({...p,name:e.target.value}))}/>
                    <input type="number" placeholder="Bonus" value={newCont.bonus} style={{flex:1}} onChange={e=>setNewCont(p=>({...p,bonus:e.target.value}))}/>
                    <button className="btn sm" style={{width:'auto',padding:'5px 10px'}} onClick={addCont}>+</button>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card">
                  <div className="ctitle">Statistieken</div>
                  <div className="igrid">
                    <div className="icell"><div className="ival">{conts.length}</div><div className="ilbl">CONTINENTEN</div></div>
                    <div className="icell"><div className="ival">{myTerr}</div><div className="ilbl">JOUW GEBIEDEN</div></div>
                    <div className="icell"><div className="ival">{conts.reduce((s,c)=>s+c.bonus,0)}</div><div className="ilbl">MAX BONUS</div></div>
                    <div className="icell"><div className="ival">{totalR}</div><div className="ilbl">TROEPEN/BEURT</div></div>
                  </div>
                </div>
                <div className="card">
                  <div className="ctitle">Spelregels</div>
                  <div style={{fontSize:10,color:'var(--muted)',lineHeight:2}}>
                    • Troepen = max(3, gebieden÷3) + bonus<br/>
                    {capsMode&&<span>• Capitals: +2 troepen per capital<br/>• Alle {totalCaps} capitals = GEWONNEN<br/></span>}
                    • <span className="cbadge">👑 KAPITAAL</span> verdedigt met 3 dobbelstenen<br/>
                    • Aanvaller: 1-3 dobbelstenen<br/>
                    • Gelijkspel = voordeel verdediger
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
  </script>
</body>
</html>
