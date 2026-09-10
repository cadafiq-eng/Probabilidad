/* HumAIno® · Probabilidad y Distribuciones · v1.2.1 augmentation */
(()=>{
  const p1=document.getElementById('p1');
  if(!p1 || document.getElementById('c-uni')) return;

  const bar=p1.querySelector('.subtab-bar');
  bar.insertAdjacentHTML('beforeend', `
    <button class="subtab-btn" id="cb-uni" onclick="swC('uni')"><span class="sticon">▭</span><span class="stlabel">Uniforme</span></button>
    <button class="subtab-btn" id="cb-exp" onclick="swC('exp')"><span class="sticon">📉</span><span class="stlabel">Exponencial</span></button>`);

  p1.insertAdjacentHTML('beforeend', `
  <div class="subpanel" id="c-uni">
    <div class="ibox"><strong>Uniforme continua U(a,b)</strong> — todos los valores entre a y b tienen la misma densidad. f(x)=1/(b−a), a≤x≤b.</div>
    <div class="g2">
      <div class="card">
        <div class="ctitle">Parámetros</div>
        <div class="fr"><label>a (límite inferior):</label><input type="number" id="ua" value="0" step="0.1" oninput="calcUni()"></div>
        <div class="fr"><label>b (límite superior):</label><input type="number" id="ub" value="10" step="0.1" oninput="calcUni()"></div>
        <div class="fr"><label>Cálculo</label><div class="seg">
          <input type="radio" name="ur" id="ur1" value="le" checked onchange="calcUni()"><label for="ur1">P(X ≤ x)</label>
          <input type="radio" name="ur" id="ur2" value="ge" onchange="calcUni()"><label for="ur2">P(X ≥ x)</label>
          <input type="radio" name="ur" id="ur3" value="bt" onchange="calcUni()"><label for="ur3">P(c ≤ X ≤ d)</label></div></div>
        <div id="uni-xr" class="fr"><label>x:</label><input type="number" id="ux" value="4" step="0.1" oninput="calcUni()"></div>
        <div id="uni-cdr" class="fr" style="display:none"><div style="display:flex;gap:10px">
          <div style="flex:1"><label>c:</label><input type="number" id="uc" value="2" step="0.1" oninput="calcUni()"></div>
          <div style="flex:1"><label>d:</label><input type="number" id="ud" value="7" step="0.1" oninput="calcUni()"></div>
        </div></div>
        <div class="fr" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <label>Cuantil para probabilidad p:</label><div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <input type="number" id="up" value="0.95" min="0" max="1" step="0.01" style="width:90px" oninput="calcUni()"><span id="uni-q" class="rv"></span></div></div>
      </div>
      <div class="card"><div class="ctitle">Resultado</div><div class="metrics" id="uni-stats"></div><div class="probs-row" id="uni-probs"></div><div class="chart-wrap" style="height:240px"><canvas id="uni-chart"></canvas></div></div>
    </div>
  </div>

  <div class="subpanel" id="c-exp">
    <div class="ibox"><strong>Exponencial Exp(β)</strong> — modela tiempos de espera entre eventos. β es el parámetro de escala y coincide con el tiempo medio de espera. Es equivalente a usar la tasa λ=1/β.<br><strong>f(x)=(1/β)e<sup>−x/β</sup>, x≥0 · E(X)=β · Var(X)=β²</strong></div>
    <div class="g2">
      <div class="card">
        <div class="ctitle">Parámetros</div>
        <div class="fr"><label>β (escala / tiempo medio):</label><input type="number" id="ebeta" value="2" min="0.0001" step="0.1" oninput="calcExp()"></div>
        <div class="fr"><label>Cálculo</label><div class="seg">
          <input type="radio" name="er" id="er1" value="le" checked onchange="calcExp()"><label for="er1">P(X ≤ x)</label>
          <input type="radio" name="er" id="er2" value="ge" onchange="calcExp()"><label for="er2">P(X ≥ x)</label>
          <input type="radio" name="er" id="er3" value="bt" onchange="calcExp()"><label for="er3">P(a ≤ X ≤ b)</label></div></div>
        <div id="exp-xr" class="fr"><label>x:</label><input type="number" id="ex" value="3" min="0" step="0.1" oninput="calcExp()"></div>
        <div id="exp-abr" class="fr" style="display:none"><div style="display:flex;gap:10px">
          <div style="flex:1"><label>a:</label><input type="number" id="ea" value="1" min="0" step="0.1" oninput="calcExp()"></div>
          <div style="flex:1"><label>b:</label><input type="number" id="eb" value="4" min="0" step="0.1" oninput="calcExp()"></div>
        </div></div>
        <div class="fr" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <label>Cuantil para probabilidad p:</label><div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <input type="number" id="ep" value="0.95" min="0" max="0.999999" step="0.01" style="width:90px" oninput="calcExp()"><span id="exp-q" class="rv"></span></div></div>
      </div>
      <div class="card"><div class="ctitle">Resultado</div><div class="metrics" id="exp-stats"></div><div class="probs-row" id="exp-probs"></div><div class="chart-wrap" style="height:240px"><canvas id="exp-chart"></canvas></div></div>
    </div>
  </div>`);

  window.swC=function(w){['nor','t','chi','f','uni','exp'].forEach(id=>{
    document.getElementById('c-'+id).classList.toggle('active',id===w);
    document.getElementById('cb-'+id).classList.toggle('active',id===w);
  });};

  window.calcUni=function(){
    const a=+document.getElementById('ua').value||0,b=+document.getElementById('ub').value||0;
    const stats=document.getElementById('uni-stats'),out=document.getElementById('uni-probs');
    if(!(b>a)){stats.innerHTML='';out.innerHTML='<div class="alert aw">Se requiere b &gt; a.</div>';return;}
    const mode=document.querySelector('input[name="ur"]:checked').value;
    document.getElementById('uni-xr').style.display=mode==='bt'?'none':'';
    document.getElementById('uni-cdr').style.display=mode==='bt'?'':'none';
    const x=+document.getElementById('ux').value||0,c=+document.getElementById('uc').value||0,d=+document.getElementById('ud').value||0;
    const CDF=v=>v<=a?0:v>=b?1:(v-a)/(b-a),PDF=v=>(v>=a&&v<=b)?1/(b-a):0;
    let prob,lo,hi,lbl;
    if(mode==='le'){prob=CDF(x);lo=a;hi=Math.min(Math.max(x,a),b);lbl=`P(X ≤ ${x.toFixed(2)})`;}
    else if(mode==='ge'){prob=1-CDF(x);lo=Math.min(Math.max(x,a),b);hi=b;lbl=`P(X ≥ ${x.toFixed(2)})`;}
    else{const c1=Math.min(c,d),d1=Math.max(c,d);prob=Math.max(0,CDF(d1)-CDF(c1));lo=Math.max(a,c1);hi=Math.min(b,d1);lbl=`P(${c1.toFixed(2)} ≤ X ≤ ${d1.toFixed(2)})`;}
    const mu=(a+b)/2,vr=(b-a)**2/12;
    stats.innerHTML=mH([{l:'E(X)',v:mu.toFixed(4)},{l:'Var(X)',v:vr.toFixed(4)},{l:'σ',v:Math.sqrt(vr).toFixed(4)},{l:'f(x)',v:(1/(b-a)).toFixed(4)}]);
    out.innerHTML=pBxC(lbl,prob);const pad=(b-a)*0.12,xs=xR(a-pad,b+pad);drawCC('uni',xs,xs.map(PDF),lo,hi);
    const p=Math.min(1,Math.max(0,+document.getElementById('up').value||0));document.getElementById('uni-q').textContent=`xₚ = ${(a+p*(b-a)).toFixed(4)}`;
  };

  window.calcExp=function(){
    const beta=Math.max(0.0001,+document.getElementById('ebeta').value||2),mode=document.querySelector('input[name="er"]:checked').value;
    document.getElementById('exp-xr').style.display=mode==='bt'?'none':'';document.getElementById('exp-abr').style.display=mode==='bt'?'':'none';
    const x=Math.max(0,+document.getElementById('ex').value||0),a=Math.max(0,+document.getElementById('ea').value||0),b=Math.max(0,+document.getElementById('eb').value||0);
    const CDF=v=>v<=0?0:1-Math.exp(-v/beta),PDF=v=>v<0?0:(1/beta)*Math.exp(-v/beta);
    let prob,lo,hi,lbl;const hiX=Math.max(x*1.15,a*1.15,b*1.15,-Math.log(0.001)*beta);
    if(mode==='le'){prob=CDF(x);lo=0;hi=x;lbl=`P(X ≤ ${x.toFixed(2)})`;}
    else if(mode==='ge'){prob=1-CDF(x);lo=x;hi=hiX;lbl=`P(X ≥ ${x.toFixed(2)})`;}
    else{const a1=Math.min(a,b),b1=Math.max(a,b);prob=CDF(b1)-CDF(a1);lo=a1;hi=b1;lbl=`P(${a1.toFixed(2)} ≤ X ≤ ${b1.toFixed(2)})`;}
    document.getElementById('exp-stats').innerHTML=mH([{l:'E(X)=β',v:beta.toFixed(4)},{l:'Var(X)=β²',v:(beta**2).toFixed(4)},{l:'σ=β',v:beta.toFixed(4)},{l:'Mediana',v:(beta*Math.log(2)).toFixed(4)}]);
    document.getElementById('exp-probs').innerHTML=pBxC(lbl,prob);const xs=xR(0,hiX);drawCC('exp',xs,xs.map(PDF),lo,hi);
    const p=Math.min(0.999999,Math.max(0,+document.getElementById('ep').value||0));document.getElementById('exp-q').textContent=`xₚ = ${(-beta*Math.log(1-p)).toFixed(4)}`;
  };

  const oldRefresh=window.refreshCharts;
  window.refreshCharts=function(){oldRefresh();calcUni();calcExp();};
  document.querySelector('.badge').textContent='v1.2.1';
  document.querySelectorAll('footer p').forEach(p=>{if(p.textContent.includes('Probabilidad y Distribuciones · v1.1'))p.innerHTML=p.innerHTML.replace('v1.1','v1.2.1');});
  calcUni();calcExp();
})();