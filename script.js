// ============================================
//  DOCERIA DA CRIS — JavaScript
//  Carrinho + WhatsApp
// ============================================

// ⚠️ COLOQUE SEU NÚMERO AQUI (55 + DDD + número)
const WHATSAPP_NUMERO = "5524999377696";

let carrinho = [];

const emojiMap = {
  "Trufa de Ninho":           "🐦",
  "Trufa de Paçoca":          "🥜",
  "Trufa de Brigadeiro":      "🍫",
  "Trufa de Coco":            "🥥",
  "Trufa de Maracujá":        "🍊",
  "Trufa Ninho com Nutella":  "🐦✨",
  "Trufa Maracujá com Nutella":"🍊✨",
  "Barra Recheada Ninho com Nutella":    "🐦🍫",
  "Barra Recheada Maracujá com Nutella": "🍊🍫",
  "Bombom de Uva 200ml":      "🍇🍫",
  "Bombom de Uva 100ml":      "🍇"
};

// ── ADICIONAR ────────────────────────────
function adicionarAoCarrinho(nome, preco, btn) {
  const idx = carrinho.findIndex(i => i.nome === nome);
  if (idx >= 0) carrinho[idx].qtd++;
  else carrinho.push({ nome, preco, qtd: 1 });

  // feedback visual no botão
  const original = btn.textContent;
  btn.textContent = "✔ Adicionado!";
  btn.style.background = "linear-gradient(135deg,#25D366,#128C7E)";
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = "";
  }, 1300);

  atualizarBarra();
}

// ── BARRA DO RODAPÉ ──────────────────────
function atualizarBarra() {
  const bar   = document.getElementById("carrinho-bar");
  const total = calcTotal();
  const qtd   = carrinho.reduce((s,i) => s + i.qtd, 0);

  if (qtd === 0) { bar.classList.add("oculto"); return; }
  bar.classList.remove("oculto");

  document.getElementById("cbar-qtd").textContent   = qtd === 1 ? "1 item" : `${qtd} itens`;
  document.getElementById("cbar-total").textContent = fmt(total);

  // contador no header
  const hq = document.getElementById("header-qtd");
  hq.textContent = qtd;
  hq.classList.remove("oculto");
}

function calcTotal() {
  return carrinho.reduce((s,i) => s + i.preco * i.qtd, 0);
}

function fmt(v) {
  return "R$ " + v.toFixed(2).replace(".",",");
}

// ── ABRIR / FECHAR ───────────────────────
function abrirCarrinho() {
  renderLista();
  document.getElementById("carrinho-overlay").classList.add("ativo");
  document.body.style.overflow = "hidden";
}

function fecharCarrinho() {
  document.getElementById("carrinho-overlay").classList.remove("ativo");
  document.body.style.overflow = "";
}

function fecharCarrinhoOverlay(e) {
  if (e.target === document.getElementById("carrinho-overlay")) fecharCarrinho();
}

document.addEventListener("keydown", e => { if (e.key === "Escape") fecharCarrinho(); });

// ── RENDERIZAR LISTA ─────────────────────
function renderLista() {
  const lista  = document.getElementById("carrinho-lista");
  const vazio  = document.getElementById("carrinho-vazio");
  const resumo = document.getElementById("carrinho-resumo");

  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.style.display  = "none";
    vazio.style.display  = "flex";
    resumo.style.display = "none";
    return;
  }

  lista.style.display  = "flex";
  vazio.style.display  = "none";
  resumo.style.display = "block";

  carrinho.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "carrinho-item";
    div.innerHTML = `
      <div class="item-info">
        <span class="item-emoji">${emojiMap[item.nome] || "🍫"}</span>
        <div>
          <div class="item-nome">${item.nome}</div>
          <div class="item-unit">${fmt(item.preco)} cada</div>
        </div>
      </div>
      <div class="item-controls">
        <button onclick="mudarQtd(${idx},-1)">−</button>
        <span>${item.qtd}</span>
        <button onclick="mudarQtd(${idx},1)">+</button>
        <div class="item-subtotal">${fmt(item.preco * item.qtd)}</div>
        <button class="item-remover" onclick="remover(${idx})">🗑</button>
      </div>`;
    lista.appendChild(div);
  });

  document.getElementById("resumo-subtotal").textContent = fmt(calcTotal());
}

function mudarQtd(idx, delta) {
  carrinho[idx].qtd = Math.max(1, carrinho[idx].qtd + delta);
  renderLista();
  atualizarBarra();
}

function remover(idx) {
  carrinho.splice(idx, 1);
  renderLista();
  atualizarBarra();
}

// ── ENVIAR WHATSAPP ──────────────────────
function enviarWhatsApp() {
  if (carrinho.length === 0) return;

  const nome = document.getElementById("input-nome").value.trim();
  const obs  = document.getElementById("input-obs").value.trim();
  const pag  = document.querySelector('input[name="pagamento"]:checked')?.value || "PIX";
  const total = calcTotal();

  let msg = "🍫 *PEDIDO — Yasmin Doces* 🍫\n";
  msg += "━━━━━━━━━━━━━━━━━━━━\n";
  if (nome) msg += `👤 *Nome:* ${nome}\n`;
  msg += "\n🛒 *Itens do pedido:*\n";
  carrinho.forEach(i => {
    msg += `• ${i.nome} x${i.qtd} — ${fmt(i.preco * i.qtd)}\n`;
  });
  msg += `\n💵 *Total: ${fmt(total)}*\n`;
  msg += `💳 *Pagamento:* ${pag}\n`;
  if (obs) msg += `📝 *Obs:* ${obs}\n`;
  msg += "\n━━━━━━━━━━━━━━━━━━━━";
  msg += "\nPor favor, confirme meu pedido! 😊";

  fecharCarrinho();
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`, "_blank");
}
