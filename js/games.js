(function () {
  const gameListEl = document.getElementById("game-list");
  if (!gameListEl || typeof Chess === "undefined") return;

  const titleEl = document.getElementById("game-title");
  const metaEl = document.getElementById("game-meta");
  const resultEl = document.getElementById("game-result");
  const moveListEl = document.getElementById("move-list");
  const moveIndicatorEl = document.getElementById("move-indicator");
  const notesEl = document.getElementById("game-notes");
  const board = new ChessBoard(document.getElementById("board"));

  const btnStart = document.getElementById("btn-start");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnEnd = document.getElementById("btn-end");
  const btnFlip = document.getElementById("btn-flip");

  let state = {
    game: null,
    positions: [],
    moves: [],
    ply: 0,
  };

  function buildGameList() {
    gameListEl.innerHTML = "";
    JOEL_GAMES.forEach((game, index) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.gameId = game.id;
      btn.innerHTML =
        game.title +
        '<span class="game-list__result">' +
        game.result +
        " · " +
        game.date +
        "</span>";
      btn.addEventListener("click", () => loadGame(game.id));
      li.appendChild(btn);
      gameListEl.appendChild(li);
      if (index === 0) btn.classList.add("is-active");
    });
  }

  function loadGame(id) {
    const game = JOEL_GAMES.find((g) => g.id === id);
    if (!game) return;

    state.game = game;
    state.ply = 0;

    const chess = new Chess();
    chess.load_pgn(game.pgn);

    state.moves = chess.history({ verbose: true });
    state.positions = [{ fen: new Chess().fen(), move: null }];

    const replay = new Chess();
    for (const move of state.moves) {
      replay.move(move.san);
      state.positions.push({
        fen: replay.fen(),
        move: move,
      });
    }

    titleEl.textContent = game.title;
    metaEl.textContent = game.white + " vs " + game.black + " · " + game.event;
    resultEl.textContent = game.result;

    notesEl.innerHTML = game.notes ? "<p>" + game.notes + "</p>" : "";

    gameListEl.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.gameId === game.id);
    });

    const joelIsBlack = game.black.includes("Van Der Werf");
    board.setOrientation(joelIsBlack ? "black" : "white");

    renderMoveList();
    goToPly(0);
  }

  function renderMoveList() {
    moveListEl.innerHTML = "";
    const temp = new Chess();

    state.moves.forEach((move, index) => {
      const ply = index + 1;
      const isWhite = ply % 2 === 1;

      if (isWhite) {
        const num = document.createElement("li");
        num.className = "move-num";
        num.textContent = Math.ceil(ply / 2) + ".";
        moveListEl.appendChild(num);
      }

      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = move.san;
      btn.dataset.ply = String(ply);
      btn.addEventListener("click", () => goToPly(ply));
      li.appendChild(btn);
      moveListEl.appendChild(li);

      temp.move(move.san);
    });
  }

  function goToPly(ply) {
    state.ply = Math.max(0, Math.min(ply, state.positions.length - 1));
    const pos = state.positions[state.ply];
    const lastMove = pos.move ? { from: pos.move.from, to: pos.move.to } : null;
    board.setPosition(pos.fen, lastMove);

    moveListEl.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", Number(btn.dataset.ply) === state.ply);
    });

    const activeBtn = moveListEl.querySelector("button.is-active");
    if (activeBtn) {
      activeBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    if (state.ply === 0) {
      moveIndicatorEl.textContent = "Start";
    } else {
      const m = state.positions[state.ply].move;
      moveIndicatorEl.textContent = m ? m.san : "Move " + state.ply;
    }

    btnStart.disabled = state.ply === 0;
    btnPrev.disabled = state.ply === 0;
    btnNext.disabled = state.ply >= state.positions.length - 1;
    btnEnd.disabled = state.ply >= state.positions.length - 1;
  }

  btnStart.addEventListener("click", () => goToPly(0));
  btnPrev.addEventListener("click", () => goToPly(state.ply - 1));
  btnNext.addEventListener("click", () => goToPly(state.ply + 1));
  btnEnd.addEventListener("click", () => goToPly(state.positions.length - 1));
  btnFlip.addEventListener("click", () => {
    board.setOrientation(board.orientation === "white" ? "black" : "white");
  });

  document.addEventListener("keydown", (e) => {
    if (!state.game) return;
    if (e.key === "ArrowLeft") {
      goToPly(state.ply - 1);
    } else if (e.key === "ArrowRight") {
      goToPly(state.ply + 1);
    }
  });

  buildGameList();
  if (JOEL_GAMES.length) {
    loadGame(JOEL_GAMES[0].id);
  }
})();
