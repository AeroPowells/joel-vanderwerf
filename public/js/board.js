/**
 * Lightweight chess board renderer.
 * Uses Lichess cburnett piece SVGs (open source).
 */
(function (global) {
  const PIECE_BASE = "https://lichess1.org/assets/piece/cburnett/";

  const PIECE_MAP = {
    K: "wK", Q: "wQ", R: "wR", B: "wB", N: "wN", P: "wP",
    k: "bK", q: "bQ", r: "bR", b: "bB", n: "bN", p: "bP",
  };

  function parseFenBoard(fen) {
    const rows = fen.split(" ")[0].split("/");
    const board = {};
    let rank = 8;
    for (const row of rows) {
      let file = 0;
      for (const ch of row) {
        if (/\d/.test(ch)) {
          file += parseInt(ch, 10);
        } else {
          const sq = String.fromCharCode(97 + file) + rank;
          board[sq] = ch;
          file += 1;
        }
      }
      rank -= 1;
    }
    return board;
  }

  function ChessBoard(container) {
    this.container = container;
    this.orientation = "white";
    this.onSquareClick = null;
    this._squareEls = {};
    this._build();
  }

  ChessBoard.prototype._build = function () {
    this.container.innerHTML = "";
    this.container.setAttribute("role", "grid");
    this._squareEls = {};

    const ranks = this.orientation === "white"
      ? [8, 7, 6, 5, 4, 3, 2, 1]
      : [1, 2, 3, 4, 5, 6, 7, 8];
    const files = this.orientation === "white"
      ? ["a", "b", "c", "d", "e", "f", "g", "h"]
      : ["h", "g", "f", "e", "d", "c", "b", "a"];

    for (const rank of ranks) {
      for (const file of files) {
        const sq = file + rank;
        const isDark = (file.charCodeAt(0) - 97 + rank) % 2 === 1;
        const el = document.createElement("button");
        el.type = "button";
        el.className = "chess-board__sq" + (isDark ? " chess-board__sq--dark" : "");
        el.dataset.square = sq;
        el.setAttribute("role", "gridcell");
        el.setAttribute("aria-label", sq);
        el.addEventListener("click", () => {
          if (this.onSquareClick) this.onSquareClick(sq);
        });
        this.container.appendChild(el);
        this._squareEls[sq] = el;
      }
    }
  };

  ChessBoard.prototype.setOrientation = function (orientation) {
    if (this.orientation !== orientation) {
      this.orientation = orientation;
      const fen = this._lastFen;
      const lastMove = this._lastMove;
      this._build();
      if (fen) this.setPosition(fen, lastMove);
    }
  };

  ChessBoard.prototype.setPosition = function (fen, lastMove) {
    this._lastFen = fen;
    this._lastMove = lastMove || null;
    const pieces = parseFenBoard(fen);

    for (const [sq, el] of Object.entries(this._squareEls)) {
      el.innerHTML = "";
      el.classList.remove(
        "chess-board__sq--highlight",
        "chess-board__sq--last-from",
        "chess-board__sq--last-to",
        "chess-board__sq--clickable"
      );

      const piece = pieces[sq];
      if (piece) {
        const img = document.createElement("img");
        img.className = "chess-board__piece";
        img.src = PIECE_BASE + PIECE_MAP[piece] + ".svg";
        img.alt = "";
        img.draggable = false;
        el.appendChild(img);
      }
    }

    if (lastMove) {
      const from = lastMove.from;
      const to = lastMove.to;
      if (this._squareEls[from]) {
        this._squareEls[from].classList.add("chess-board__sq--last-from");
      }
      if (this._squareEls[to]) {
        this._squareEls[to].classList.add("chess-board__sq--last-to");
      }
    }
  };

  ChessBoard.prototype.setClickable = function (enabled) {
    for (const el of Object.values(this._squareEls)) {
      el.classList.toggle("chess-board__sq--clickable", enabled);
    }
  };

  global.ChessBoard = ChessBoard;
})(window);
