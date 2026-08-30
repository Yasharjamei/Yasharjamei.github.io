/*!
 * entropy-field.js — order-to-chaos particle field, zero dependencies.
 *
 * Framework-free port of components/ui/entropy-field.tsx, for plain HTML sites.
 *
 * Usage:
 *   <div data-entropy-field></div>
 *   <script src="entropy-field.js"></script>
 *
 * The element is filled by a canvas sized to it, and re-seeds on resize.
 * Every option is optional and set via data-* attributes:
 *
 *   data-order-color="#202825"   particle colour, ordered (left) side
 *   data-chaos-color="#b36d4d"   particle colour, chaotic (right) side
 *   data-line-color="#171717"    connecting lines + centre divider
 *   data-spacing="24"            px between particles in the starting lattice
 *   data-neighbor-radius="90"    px within which particles interact
 *   data-link-radius="48"        px within which a line is drawn
 *   data-dot-size="1.6"          particle radius in px
 *   data-divider="true"          draw the vertical centre divider
 *
 * Honours prefers-reduced-motion: paints one static frame instead of animating,
 * and starts/stops live if the preference changes.
 */
(function () {
  'use strict';

  function withAlpha(hex, alpha) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', ' + alpha + ')';
  }

  function num(el, name, fallback) {
    var v = parseFloat(el.getAttribute(name));
    return isNaN(v) ? fallback : v;
  }

  function init(host) {
    if (host.__entropyField) return;
    host.__entropyField = true;

    var orderColor = host.getAttribute('data-order-color') || '#202825';
    var chaosColor = host.getAttribute('data-chaos-color') || '#b36d4d';
    var lineColor = host.getAttribute('data-line-color') || '#171717';
    var spacing = num(host, 'data-spacing', 24);
    var neighborRadius = num(host, 'data-neighbor-radius', 90);
    var linkRadius = num(host, 'data-link-radius', 48);
    var dotSize = num(host, 'data-dot-size', 1.6);
    var divider = host.getAttribute('data-divider') !== 'false';

    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

    var canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.display = 'block';
    host.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduceMotion = motionQuery.matches;

    var w = 0, h = 0, raf = 0, time = 0;
    var particles = [];
    var buckets = {};

    function rebuildNeighbors() {
      buckets = {};
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var k = Math.floor(p.x / neighborRadius) + ',' + Math.floor(p.y / neighborRadius);
        (buckets[k] || (buckets[k] = [])).push(p);
      }
      for (var a = 0; a < particles.length; a++) {
        var q = particles[a];
        var cx = Math.floor(q.x / neighborRadius), cy = Math.floor(q.y / neighborRadius);
        var found = [];
        for (var dx = -1; dx <= 1; dx++) {
          for (var dy = -1; dy <= 1; dy++) {
            var b = buckets[cx + dx + ',' + (cy + dy)];
            if (!b) continue;
            for (var c = 0; c < b.length; c++) {
              var o = b[c];
              if (o === q) continue;
              if (Math.hypot(q.x - o.x, q.y - o.y) < neighborRadius) found.push(o);
            }
          }
        }
        q.neighbors = found;
      }
    }

    function seed() {
      particles = [];
      var cols = Math.max(2, Math.round(w / spacing));
      var rows = Math.max(2, Math.round(h / spacing));
      var sx = w / cols, sy = h / rows;
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          var x = sx * i + sx / 2, y = sy * j + sy / 2;
          particles.push({
            x: x, y: y, originalX: x, originalY: y,
            order: x < w / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            influence: 0, neighbors: []
          });
        }
      }
      rebuildNeighbors();
    }

    function update(p) {
      if (p.order) {
        var dx = p.originalX - p.x, dy = p.originalY - p.y;
        var cix = 0, ciy = 0;
        for (var i = 0; i < p.neighbors.length; i++) {
          var n = p.neighbors[i];
          if (n.order) continue;
          var d = Math.hypot(p.x - n.x, p.y - n.y);
          var s = Math.max(0, 1 - d / neighborRadius);
          cix += n.vx * s; ciy += n.vy * s;
          p.influence = Math.max(p.influence, s);
        }
        p.x += dx * 0.05 * (1 - p.influence) + cix * p.influence;
        p.y += dy * 0.05 * (1 - p.influence) + ciy * p.influence;
        p.influence *= 0.99;
      } else {
        p.vx = (p.vx + (Math.random() - 0.5) * 0.5) * 0.95;
        p.vy = (p.vy + (Math.random() - 0.5) * 0.5) * 0.95;
        p.x += p.vx; p.y += p.vy;
        if (p.x < w / 2 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(w / 2, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      if (time % 30 === 0) rebuildNeighbors();

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        update(p);

        for (var j = 0; j < p.neighbors.length; j++) {
          var n = p.neighbors[j];
          var d = Math.hypot(p.x - n.x, p.y - n.y);
          if (d >= linkRadius) continue;
          ctx.strokeStyle = withAlpha(lineColor, 0.16 * (1 - d / linkRadius));
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }

        ctx.fillStyle = withAlpha(p.order ? orderColor : chaosColor,
          p.order ? 0.75 - p.influence * 0.35 : 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (divider) {
        ctx.strokeStyle = withAlpha(lineColor, 0.22);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
      }

      time++;
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    }

    function resize() {
      var rect = host.getBoundingClientRect();
      var nw = Math.max(1, Math.round(rect.width));
      var nh = Math.max(1, Math.round(rect.height));
      if (nw === w && nh === h) return;
      w = nw; h = nh;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduceMotion) frame();
    }

    function onMotionChange() {
      reduceMotion = motionQuery.matches;
      if (reduceMotion) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        frame();
      } else {
        start();
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(host);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
    else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);

    if (!reduceMotion) start();
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-entropy-field]');
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.EntropyField = { init: init, boot: boot };
})();
