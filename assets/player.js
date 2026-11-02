(function (root) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Tô màu cú pháp C++ rất đơn giản
  function hlCode(line) {
    return esc(line).replace(
      /(\/\/.*$)|\b(int|void|for|while|if|else|return|break|bool|true|false|const|auto)\b|\b(vector|swap)\b|\b(\d+)\b/g,
      function (m, c, k, f, n) {
        if (c) return '<span class="tk-c">' + c + '</span>';
        if (k) return '<span class="tk-k">' + k + '</span>';
        if (f) return '<span class="tk-f">' + f + '</span>';
        return '<span class="tk-n">' + n + '</span>';
      }
    );
  }

  // Hàng ô số dùng chung cho các thuật toán
  var Viz = {
    esc: esc,
    cells: function (vals, opt) {
      opt = opt || {};
      var h = '<div class="row">';
      for (var i = 0; i < vals.length; i++) {
        var c = opt.cls ? opt.cls(i) : '';
        var m = opt.mk ? opt.mk(i) : '';
        var lab = opt.idx ? opt.idx(i) : i;
        var v = opt.blank && opt.blank(i) ? '' : esc(vals[i]);
        h += '<div class="cw"><div class="cell ' + c + '">' + v + '</div>' +
          '<div class="idx">' + lab + '</div><div class="mk">' + (m || '&nbsp;') + '</div></div>';
      }
      return h + '</div>';
    }
  };

  function parse(str) {
    var parts = str.split(/[\s,;]+/).filter(Boolean);
    if (parts.length < 1 || parts.length > 12) return { err: 'Nhập từ 1 đến 12 số, cách nhau bằng dấu phẩy.' };
    var nums = parts.map(Number);
    if (nums.some(function (x) { return !Number.isInteger(x) || Math.abs(x) > 999; })) {
      return { err: 'Chỉ nhận số nguyên, giá trị tuyệt đối tối đa 999.' };
    }
    return { arr: nums };
  }

  function randomArr() {
    var out = [];
    while (out.length < 8) {
      var x = 1 + Math.floor(Math.random() * 99);
      if (out.indexOf(x) < 0) out.push(x);
    }
    return out;
  }

  var Player = {
    init: function (A) {
      var app = document.getElementById('app');
      document.title = A.title + ' trực quan';
      app.innerHTML =
        '<header class="top"><a class="back" href="index.html">&larr; Tất cả thuật toán</a>' +
        '<h1>' + esc(A.title) + '</h1><p class="sub">' + esc(A.idea) + '</p>' +
        '<div class="badges">' +
        A.badges.map(function (b) { return '<span class="badge"><b>' + esc(b[0]) + '</b> ' + esc(b[1]) + '</span>'; }).join('') +
        '</div></header>' +
        '<form class="inputbar" id="form"><label>Mảng <input id="inp" autocomplete="off" spellcheck="false"></label>' +
        '<button type="submit">Áp dụng</button><button type="button" id="rand">Ngẫu nhiên</button>' +
        '<span class="err" id="err"></span></form>' +
        '<main class="grid">' +
        '<section class="panel"><div class="ptitle">Code C++ <span class="hint">dòng đang chạy được tô sáng</span></div>' +
        '<pre class="code" id="code"></pre></section>' +
        '<section class="panel"><div class="legend" id="legend"></div><div id="note" class="note"></div>' +
        '<div id="vars" class="vars"></div><div id="viz" class="viz"></div></section>' +
        '</main>' +
        '<footer class="controls"><button id="first">Đầu</button><button id="prev">&larr; Lùi</button>' +
        '<button id="play" class="primary">&#9654; Tự chạy</button><button id="next">Tiếp &rarr;</button>' +
        '<button id="last">Cuối</button><input type="range" id="seek" min="0" value="0">' +
        '<span id="count"></span><label class="speed">Tốc độ <input type="range" id="speed" min="1" max="10" value="5"></label></footer>';

      var $ = function (id) { return document.getElementById(id); };
      var codeEl = $('code'), viz = $('viz'), varsEl = $('vars'), noteEl = $('note');
      var inp = $('inp'), errEl = $('err'), seek = $('seek'), count = $('count'), playBtn = $('play');

      codeEl.innerHTML = A.code.map(function (l, i) {
        return '<div class="ln"><span class="no">' + (i + 1) + '</span><span class="tx">' + hlCode(l) + '</span></div>';
      }).join('');
      var lines = codeEl.querySelectorAll('.ln');

      $('legend').innerHTML = (A.legend || []).map(function (l) {
        return '<span class="lg"><i class="sw ' + l[0] + '"></i>' + esc(l[1]) + '</span>';
      }).join('');

      var steps = [], k = 0, timer = null;

      function delay() { return 1700 - Number($('speed').value) * 160; }

      function stop() {
        if (timer) { clearInterval(timer); timer = null; }
        playBtn.innerHTML = '&#9654; Tự chạy';
      }

      function draw() {
        var s = steps[k];
        for (var i = 0; i < lines.length; i++) lines[i].classList.toggle('on', i + 1 === s.line);
        var el = lines[s.line - 1];
        if (el) {
          var top = el.offsetTop, bottom = top + el.offsetHeight;
          if (top < codeEl.scrollTop + 20) codeEl.scrollTop = Math.max(0, top - 60);
          else if (bottom > codeEl.scrollTop + codeEl.clientHeight - 20) codeEl.scrollTop = bottom - codeEl.clientHeight + 60;
        }
        viz.innerHTML = A.render(s, k > 0 ? steps[k - 1] : null);
        varsEl.innerHTML = A.vars(s).map(function (g) {
          return '<div class="vg"><span class="vl">' + esc(g.label) + '</span>' +
            g.items.map(function (it) {
              return '<span class="chip"><i>' + esc(it[0]) + '</i> = <b>' + esc(it[1]) + '</b></span>';
            }).join('') + '</div>';
        }).join('');
        noteEl.textContent = s.note;
        count.textContent = 'Bước ' + (k + 1) + ' / ' + steps.length;
        seek.value = k;
        $('prev').disabled = $('first').disabled = k === 0;
        $('next').disabled = $('last').disabled = k === steps.length - 1;
      }

      function load(arr) {
        stop();
        steps = A.gen(arr.slice());
        k = 0;
        seek.max = steps.length - 1;
        draw();
      }

      function go(n) { stop(); k = Math.max(0, Math.min(steps.length - 1, n)); draw(); }

      function play() {
        if (timer) { stop(); return; }
        if (k >= steps.length - 1) { k = 0; draw(); }
        playBtn.innerHTML = '&#10074;&#10074; Dừng';
        timer = setInterval(function () {
          if (k >= steps.length - 1) { stop(); return; }
          k++; draw();
        }, delay());
      }

      $('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var r = parse(inp.value);
        if (r.err) { errEl.textContent = r.err; return; }
        errEl.textContent = '';
        load(r.arr);
      });
      $('rand').addEventListener('click', function () {
        var a = randomArr();
        inp.value = a.join(', ');
        errEl.textContent = '';
        load(a);
      });
      $('first').addEventListener('click', function () { go(0); });
      $('prev').addEventListener('click', function () { go(k - 1); });
      $('next').addEventListener('click', function () { go(k + 1); });
      $('last').addEventListener('click', function () { go(steps.length - 1); });
      playBtn.addEventListener('click', play);
      seek.addEventListener('input', function () { go(Number(seek.value)); });
      $('speed').addEventListener('input', function () {
        if (timer) { stop(); play(); }
      });
      document.addEventListener('keydown', function (e) {
        var tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' && e.target.type === 'text') return;
        if (e.key === 'ArrowRight') { e.preventDefault(); go(k + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(k - 1); }
        else if (e.key === ' ' && tag !== 'BUTTON') { e.preventDefault(); play(); }
      });

      inp.value = A.defaultArr.join(', ');
      load(A.defaultArr);
    }
  };

  root.Viz = Viz;
  root.Player = Player;
  if (typeof module !== 'undefined') module.exports = { Viz: Viz, Player: Player };
})(typeof window !== 'undefined' ? window : globalThis);
