const mainScript = () => {
  // ── Animation Utilities from animation.js ──
  const parseRem = (input) => {
    return (input / 10) * parseFloat(getComputedStyle(document.querySelector('html')).fontSize)
  }
  function getScreenType() {
    const width = window.innerWidth;
    let type = width > 991 ? 'dsk' : window.innerWidth > 767 ? 'tb' : 'mb';
    let size = width;
    const isMobile = width <= 767;
    const isTablet = width > 767 && width <= 991;
    const isDesktop = width > 991;
    return { type, size, isMobile, isDesktop, isTablet };
  }
  function convertHyphenDOM(el) {
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue.replace(/-/g, '‑');
      }
    });
  }
  class MasterTimeline {
    constructor({ triggerInit, timeline, tweenArr, stagger = .1, scrollTrigger, allowMobile }) {
      this.timeline = timeline;
      this.triggerInit = triggerInit;
      this.scrollTrigger = scrollTrigger;
      this.tweenArr = tweenArr;
      this.stagger = stagger;
      this.allowMobile = getScreenType().isMobile ? allowMobile : true;
      document.fonts.ready.then(() => this.setup());
    }
    setup() {
      if (!this.allowMobile) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: this.triggerInit,
          start: 'top bottom+=100vh',
          end: 'bottom top',
          once: true,
          scrub: false,
          onEnter: () => {
            this.tweenArr.forEach((item) => item.init?.())
          }
        }
      });
      if (!this.timeline) {
        this.timeline = gsap.timeline({
          scrollTrigger: {
            start: 'top top+=80%',
            end: '+=100%',
            scrub: false,
            once: true,
            ...this.scrollTrigger
          }
        })
      };
      this.tweenArr.forEach((item) => this.timeline.add(item.animation, item.delay || `<=${this.stagger}` || "<=.1"));
    }
  }
  class RevealText {
    constructor({ el, color, delay, isDisableRevert, isHighlight = false, isFast = false, ...props }) {
      this.DOM = { el: el };
      this.color = color;
      this.textSplit = [];
      this.delay = delay;
      this.textSplit = SplitText.create(this.DOM.el, { type: 'lines, words' });
      const isColorDefault = this.color === 'white' || this.color === 'black';
      this.fromColor = !isColorDefault ? 'rgba(255,255,255, 0)' : this.color == 'white' ? 'rgba(255,255,255, 0)' : 'rgba(29,29,29, 0)';
      this.toColor = !isColorDefault ? this.color : this.color == 'white' ? 'rgba(255,255,255, 1)' : 'rgba(29,29,29, 1)';

      if (isHighlight) {
        this.animation = gsap.timeline({
          onComplete: () => {
            if (!isDisableRevert) {
              this.textSplit.revert();
            }
          },
          ...props
        });
        this.textSplit.words.forEach((word, idx) => {
          let toColor = word.closest('.txt-highlight') ? '#FF6B30' : this.toColor;
          this.animation.to(word, {
            keyframes: {
              color: [this.fromColor, '#FF6B30', toColor],
              easeEach: 'power2.in',
              ease: 'power1.out',
            },
            duration: isFast ? 0.8 : 1
          }, idx * (isFast ? 0.03 : 0.08))
        });
      }
      else {
        this.animation = gsap.to(this.textSplit.words, {
          keyframes: {
            color: [this.fromColor, '#232323', this.toColor],
            easeEach: 'power2.in',
            ease: 'power1.out',
          },
          duration: isFast ? 0.8 : 1,
          stagger: isFast ? 0.03 : 0.08,
          onComplete: () => {
            if (!isDisableRevert) {
              this.textSplit.revert();
            }
          },
          ...props
        })
      }
    }
    init() {
      gsap.set(this.textSplit.words, { color: this.fromColor });
    }
  }
  class RevealTextReset {
    constructor({ el, color, delay, isFast = false, isHighlight = false, ...props }) {
      this.DOM = { el: el };
      this.color = color;
      this.textSplit = [];
      this.delay = delay;
      this.isHighlight = isHighlight
      this.isFast = isFast;

      this.textSplit = SplitText.create(this.DOM.el, { type: 'lines, words' });
      this.isColorDefault = this.color === 'white' || this.color === 'black';
      this.fromColor = !this.isColorDefault ? 'rgba(255,255,255, 0)' : this.color == 'white' ? 'rgba(255,255,255, 0)' : 'rgba(29,29,29, 0)';
      this.toColor = !this.isColorDefault ? this.color : this.color == 'white' ? 'rgba(255,255,255, 1)' : 'rgba(29,29,29, 1)';

      if (this.isHighlight) {
        this.animation = gsap.timeline({
          onComplete: () => {
            this.reset();
          },
          ...props
        });

        this.textSplit.words.forEach((word, idx) => {
          let toColor = word.closest('.txt-highlight') ? '#FF6B30' : this.toColor;
          this.animation.to(word, {
            keyframes: {
              color: [this.fromColor, '#FF6B30', toColor],
              easeEach: 'power2.in',
              ease: 'power1.out',
            },
            duration: isFast ? 0.8 : 1
          }, idx * (isFast ? 0.03 : 0.08))
        });
      }
      else {
        this.animation = gsap.to(this.textSplit.words, {
          keyframes: {
            color: [this.fromColor, '#FF6B30', this.toColor],
            easeEach: 'power2.in',
            ease: 'power1.out',
          },
          duration: isFast ? 0.8 : 1,
          stagger: isFast ? 0.03 : 0.08,
          onComplete: () => {
            this.reset();
          },
          ...props
        })
      }
    }
    init() {
      if (getScreenType().isMobile) {
        this.fromColor = !this.isColorDefault ? 'rgba(255,255,255, .1)' : this.color == 'white' ? 'rgba(255,255,255, .1)' : 'rgba(29,29,29, .1)';
        this.reset()
      }
      gsap.set(this.textSplit.words, { color: this.fromColor });
    }
    reset() {
      let isReset = true;
      let isInit = getScreenType().isMobile ? true : false;

      let tlText = gsap.timeline();
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.DOM.el,
          start: 'top top+=65%',
          end: 'bottom top+=65%',
          onEnter: () => {
            if (isReset && isInit) {
              isReset = false;
              if (this.isHighlight) {
                this.textSplit.words.forEach((word, idx) => {
                  let toColor = word.closest('.txt-highlight') ? '#FF6B30' : this.toColor;
                  tlText.to(word, {
                    keyframes: {
                      color: [this.fromColor, '#FF6B30', toColor],
                      easeEach: 'power2.in',
                      ease: 'power1.out',
                    },
                    duration: this.isFast ? 0.8 : 1
                  }, idx * (this.isFast ? 0.03 : 0.08))
                });
              }
              else {
                gsap.to(this.textSplit.words, {
                  keyframes: {
                    color: [this.fromColor, '#FF6B30', this.toColor],
                    easeEach: 'power2.in',
                    ease: 'power1.out',
                  },
                  overwrite: true,
                  duration: this.isFast ? .8 : 1,
                  stagger: this.isFast ? .03 : .08,
                })
              }
            }
          },
        }
      })
      let resetTL = gsap.timeline({
        scrollTrigger: {
          trigger: this.DOM.el,
          start: 'top bottom',
          end: 'bottom top',
          onLeaveBack: () => {
            if (!isInit) {
              this.fromColor = !this.isColorDefault ? 'rgba(255,255,255, .1)' : this.color == 'white' ? 'rgba(255,255,255, .1)' : 'rgba(29,29,29, .1)';
            }
            isInit = true;

            if (!isReset) isReset = true;
            gsap.set(this.textSplit.words, { color: this.fromColor, overwrite: true })
          },
        }
      })
    }
  }
  class FadeSplitText {
    constructor({ el, delay, splitType, isDisableRevert, ...props }) {
      if (!el || el.textContent === '') return;
      this.DOM = { el: el };
      this.delay = delay;
      this.textSplit = null;
      this.splitType = splitType || 'words';
      let animation;
      document.fonts.ready.then(() => {
        console.log(this.splitType);
        this.textSplit = SplitText.create(this.DOM.el, {
          type: this.splitType === 'words' ? "lines words" : `lines words ${this.splitType}`,
          mask: "lines",
          wordsClass: 'words-split',
          onSplit: (self) => {
            gsap.set(self[this.splitType], { autoAlpha: 0, yPercent: 100 });
            animation = gsap.to(self[this.splitType], {
              autoAlpha: 1,
              yPercent: 0,
              stagger: this.splitType === 'words' ? 0.025 : this.splitType === 'chars' ? 0.05 : 0.1,
              duration: this.splitType === 'chars' ? 0.5 : .8,
              willChange: 'transform, opacity',
              ease: 'power2.out',
              clearProps: 'overflow',
              onComplete: () => {
                if (!isDisableRevert) {
                  self.revert();
                  convertHyphenDOM(self.elements[0]);
                }
                else {
                  gsap.set(this.DOM.el.querySelectorAll('[aria-hidden="true"]'), { clearProps: 'overflow' });
                }
              },
              onStart: () => {
                setTimeout(() => {
                  if (this.DOM.el.querySelectorAll('.txt-strike').length !== 0) {
                    this.DOM.el.querySelectorAll('.txt-strike').forEach(element => element.classList.add('active'));
                  }
                  if (this.DOM.el.querySelectorAll('.heading-decor').length !== 0) {
                    this.DOM.el.querySelectorAll('.heading-decor').forEach(element => element.classList.add('active'));
                  }
                }, 450);
              },
              ...props
            });
          }
        });
        this.animation = animation;
      })
    }
    init() {
      document.fonts.ready.then(() => {

      })
    }
  }
  class FadeIn {
    constructor({ el, type, delay, isDisableRevert, from, to, ...props }) {
      this.DOM = { el: el };
      this.type = type || 'default';
      this.delay = delay;
      this.options = {
        bottom: {
          set: { opacity: 0, y: parseRem(32), ...from },
          to: { opacity: 1, y: 0, ...to }
        },
        top: {
          set: { opacity: 0, y: parseRem(-32), ...from },
          to: { opacity: 1, y: 0, ...to }
        },
        left: {
          set: { opacity: 0, x: parseRem(32), ...from },
          to: { opacity: 1, x: 0, ...to },
        },
        right: {
          set: { opacity: 0, x: parseRem(-32), ...from },
          to: { opacity: 1, x: 0, ...to }
        },
        default: {
          set: { opacity: 0, y: parseRem(32), ...from },
          to: { opacity: 1, y: 0, ...to }
        }
      };

      if (!this.DOM.el) return;
      this.animation = gsap.fromTo(this.DOM.el,
        { ...this.options[this.type]?.set || this.options.default.set },
        {
          ...this.options[this.type]?.to || this.options.default.to,
          duration: 1,
          ease: 'power3',
          clearProps: isDisableRevert ? '' : 'all',
          ...props
        });
    }
    init() {
      if (!this.DOM.el) return;
      gsap.set(this.DOM.el, { ...this.options[this.type]?.set || this.options.default.set });
    }
  }
  class ScaleDash {
    constructor({ el, type, isCenter, delay, isDisableRevert, ...props }) {
      this.DOM = { el: el };
      this.type = type || 'default';
      this.delay = delay;
      this.widthItem = this.DOM.el.offsetWidth || 0;
      this.heightItem = this.DOM.el.offsetHeight || 0;
      this.options = {
        top: {
          set: { height: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
          to: { height: this.heightItem }
        },
        bottom: {
          set: { height: 0, transformOrigin: isCenter ? 'center center' : 'bottom left' },
          to: { height: this.heightItem }
        },
        left: {
          set: { width: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
          to: { width: this.widthItem }
        },
        right: {
          set: { width: 0, transformOrigin: isCenter ? 'center center' : 'top right' },
          to: { width: this.widthItem }
        },
        default: {
          set: { height: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
          to: { height: this.heightItem }
        }
      };
      this.animation = gsap.fromTo(this.DOM.el,
        { ...this.options[this.type]?.set || this.options.default.set },
        {
          ...this.options[this.type]?.to || this.options.default.to,
          duration: 1.2,
          ease: 'power1.out',
          clearProps: isDisableRevert ? '' : 'all',
          ...props
        });
    }
    init() {
      if (!this.DOM?.el) return;

      gsap.set(this.DOM.el, { ...this.options[this.type]?.set || this.options.default.set });
    }
    destroy() {
      this.animation.kill();
    }
  }
  class ScaleLine {
    constructor({ el, type, isCenter, delay, isDisableRevert, ...props }) {
      if (!el) return;

      this.DOM = { el: el };
      this.type = type || 'default';
      this.delay = delay;
      this.options = {
        top: {
          set: { scaleY: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
          to: { scaleY: 1 }
        },
        left: {
          set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
          to: { scaleX: 1 }
        },
        right: {
          set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'top right' },
          to: { scaleX: 1 }
        },
        bottom: {
          set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'bottom right' },
          to: { scaleX: 1 }
        },
        default: {
          set: { scaleX: 0, transformOrigin: isCenter ? 'center center' : 'top left' },
          to: { scaleX: 1 }
        }
      };
      this.animation = gsap.fromTo(this.DOM.el,
        { ...this.options[this.type]?.set || this.options.default.set },
        {
          ...this.options[this.type]?.to || this.options.default.to,
          duration: 1.2,
          ease: 'power1.out',
          clearProps: isDisableRevert ? '' : 'all',
          ...props
        });
    }
    init() {
      if (!this.DOM?.el) return;

      gsap.set(this.DOM.el, { ...this.options[this.type]?.set || this.options.default.set });
    }
  }
  class ScaleInset {
    constructor({ el, elInner, delay, duration, isDisableRevert }) {
      this.DOM = {
        el: el, elInner: elInner || el?.querySelector('img')
      };
      this.delay = delay;
      this.borderRad = gsap.getProperty(this.DOM.el, 'border-radius');
      this.animation = gsap
        .timeline()
        .to(this.DOM.el,
          { clipPath: `inset(0% round ${this.borderRad}px)`, duration: 2, ease: 'expo.out', clearProps: isDisableRevert ? '' : 'all' })
        .to(this.DOM.elInner,
          { scale: 1, duration: 2, autoAlpha: 1, ease: 'expo.out', clearProps: isDisableRevert ? '' : 'all', overwrite: true }, "<=0")
    }
    init() {
      if (!this.DOM.el) return;
      gsap.set(this.DOM.el, { clipPath: `inset(20% round ${this.borderRad}px)` });
      gsap.set(this.DOM.elInner, { scale: 1.4, autoAlpha: 0 });
    }
  }

  // ───────────────────────────────────────────

  $.easing.exponentialEaseOut = function (t) {
    return Math.min(1, 1.001 - Math.pow(2, -10 * t));
  };
  const convertHyphen = (field) => {
    return field.replace(/-/g, '‑')
  }
  $.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
  };
  if (typeof SplitText !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText);
  } else {
    gsap.registerPlugin(ScrollTrigger);
  }
  const childSelect = (parent) => {
    return (child) => (child ? $(parent).find(child) : parent);
  };
  function activeItem(elArr, index) {
    elArr.forEach((el, idx) => {
      $(el).removeClass("active").eq(index).addClass("active");
    });
  }
  const xSetter = (el) => gsap.quickSetter(el, "x", "px");
  const ySetter = (el) => gsap.quickSetter(el, "y", "px");
  const xGetter = (el) => gsap.getProperty(el, "x");
  const yGetter = (el) => gsap.getProperty(el, "y");

  const viewport = {
    get w() {
      return window.innerWidth;
    },
    get h() {
      return window.innerHeight;
    },
  };

  let cachedSvh100 = null;
  const getSvh100 = () => {
    if (cachedSvh100 != null) return cachedSvh100;
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;top:0;left:0;height:100svh;width:0;pointer-events:none;visibility:hidden;";
    document.body.appendChild(el);
    cachedSvh100 = el.getBoundingClientRect().height;
    document.body.removeChild(el);
    return cachedSvh100;
  };
  window.addEventListener("resize", () => {
    cachedSvh100 = null;
  });
  const cvUnit = (val, unit) => {
    let result;
    switch (true) {
      case unit === "vw":
        result = window.innerWidth * (val / 100);
        break;
      case unit === "vh":
        result =
          (window.innerWidth <= 767 ? getSvh100() : window.innerHeight) *
          (val / 100);
        break;
      case unit === "svh":
        result = getSvh100() * (val / 100);
        break;
      case unit === "rem":
        result = (val / 10) * parseFloat($("html").css("font-size"));
        break;
      default:
        break;
    }
    return result;
  };
  const isInViewport = (el, orientation = "vertical") => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (orientation == "horizontal") {
      return rect.left <= window.innerWidth && rect.right >= 0;
    } else {
      return rect.top <= window.innerHeight && rect.bottom >= 0;
    }
  };
  const debounce = (func, timeout = 300) => {
    let timer;

    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  }
  const closestEdge = (x, y, w, h) => {
    const topEdgeDist = distMetric(x, y, w / 2, 0);
    const bottomEdgeDist = distMetric(x, y, w / 2, h);
    const min = Math.min(topEdgeDist, bottomEdgeDist);
    return min === topEdgeDist ? "top" : "bottom";
  };
  const distMetric = (x, y, x2, y2) => {
    var xDiff = x - x2;
    var yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const lerp = (a, b, t) => (1 - t) * a + t * b;

  class ImageBinder {
    static SVG_NS = "http://www.w3.org/2000/svg";

    constructor(container, options = {}) {
      this.container = container;
      this.blindCount = options.blindCount ?? viewport.w > 767 ? 24 : 12;
      this.layerSelector = options.layerSelector || ".layer";
      this.onLayoutComplete = options.onLayoutComplete || null;
      this.duration = options.duration || .015
      this.blindsSets = [];
      this._resizeHandler = null;
    }

    createBlinds(groupId) {
      const g = document.getElementById(groupId);
      if (!g) return null;
      g.innerHTML = "";

      const width = this.container.offsetWidth;
      const height = this.container.offsetHeight;
      const vbHeight = (height / width) * 100;
      const h = vbHeight / this.blindCount;
      const blinds = [];
      let currentY = 0;

      for (let i = 0; i < this.blindCount; i++) {
        const centerY = vbHeight - (currentY + h / 2);

        const rectTop = document.createElementNS(ImageBinder.SVG_NS, "rect");
        const rectBottom = document.createElementNS(ImageBinder.SVG_NS, "rect");

        [rectTop, rectBottom].forEach((r) => {
          r.setAttribute("x", 0);
          r.setAttribute("width", 100);
          r.setAttribute("height", 0);
          r.setAttribute("fill", "white");
          r.setAttribute("shape-rendering", "crispEdges");
        });

        rectTop.setAttribute("y", centerY);
        rectBottom.setAttribute("y", centerY);

        g.appendChild(rectTop);
        g.appendChild(rectBottom);

        blinds.push({
          top: rectTop,
          bottom: rectBottom,
          y: centerY,
          h: h / 2,
        });
        currentY += h;
      }
      return blinds;
    }

    updateLayout(container) {
      const el = container || this.container;
      if (!el) return;

      const width = el.offsetWidth;
      const height = el.offsetHeight;
      console.log(width, height)
      const vbWidth = 100;
      const vbHeight = (height / width) * 100;

      const layers = el.querySelectorAll(this.layerSelector);
      this.blindsSets = [];

      layers.forEach((svg, i) => {
        svg.setAttribute("viewBox", `0 0 ${vbWidth} ${vbHeight}`);

        const maskEl = svg.querySelector("mask");
        const maskId = `ib-mask-${i}`;
        const blindsId = `ib-blinds-${i}`;

        if (maskEl) {
          maskEl.id = maskId;
          const maskRect = maskEl.querySelector("rect");
          if (maskRect) {
            maskRect.setAttribute("width", vbWidth);
            maskRect.setAttribute("height", vbHeight);
          }
        }

        const img = svg.querySelector("image");
        if (img) {
          img.setAttribute("width", vbWidth);
          img.setAttribute("height", vbHeight);
          img.setAttribute("mask", `url(#${maskId})`);
        }

        const blindG = svg.querySelector('g[id^="blinds"], g[id^="ib-blinds"]');
        if (blindG) {
          blindG.id = blindsId;
          const blinds = this.createBlinds(blindsId);
          if (blinds) this.blindsSets.push(blinds);
        }
      });

      this.onLayoutComplete?.(this.blindsSets);
    }

    openBlinds(blinds) {
      const set = blinds || this.blindsSets[0];
      if (!set?.length) return gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top bottom',
          end: 'bottom top',
        }
      });

      return gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top bottom',
          end: 'bottom+=100% top',
        }
      }).to(
        set.flatMap((b) => [b.top, b.bottom]),
        {
          attr: {
            y: (i) => {
              const b = set[Math.floor(i / 2)];
              return i % 2 === 0 ? b.y - b.h : b.y;
            },
            height: (i) => {
              const b = set[Math.floor(i / 2)];
              return b.h + 0.01;
            },
          },
          ease: "none",
          stagger: { each: this.duration, from: "start" },
        }
      );
    }

    closeBlinds(blinds) {
      const set = blinds || this.blindsSets[0];
      if (!set?.length) return;
      set.forEach((b) => {
        [b.top, b.bottom].forEach((r) => {
          r.setAttribute("y", b.y);
          r.setAttribute("height", 0);
        });
      });
    }

    init() {
      this.updateLayout(this.container);
    }

    destroy() {
      this.blindsSets = [];
      this.container = null;
    }
  }

  const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const normalize = (mousePos, maxDis) => (mousePos / maxDis - 0.5) * 2;
  const getAllScrollTrigger = (fn) => {
    let triggers = ScrollTrigger.getAll();
    triggers.forEach((trigger) => {
      if (fn === "refresh") {
        if (trigger.progress === 0) {
          trigger[fn]?.();
        }
      } else {
        trigger[fn]?.();
      }
    });
  };
  function documentHeightObserver(action, data, callback) {
    let resizeObserver;
    let debounceTimer;
    let observerEl = data?.next.container;
    let previousHeight = observerEl?.scrollHeight;

    function onRefresh() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const currentHeight = observerEl.scrollHeight;

        if (currentHeight !== previousHeight) {
          if (smoothScroll.lenis) {
            smoothScroll.lenis.resize();
            ScrollTrigger.getAll().forEach((trigger) => {
              if (trigger.progress === 0 || trigger.vars?.scrub) {
                trigger.refresh();
              }
            });
          }
          if (callback) {
            callback();
          }
          previousHeight = currentHeight;
        }
      }, 200);
    }

    if (action === "init") {
      if (!observerEl) return;
      resizeObserver = new ResizeObserver(onRefresh);
      resizeObserver.observe(observerEl);
    } else if (action === "disconnect") {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    }
  }
  function resetScroll(data) {
    if (window.location.hash !== "") {
      if ($(window.location.hash).length >= 1) {
        if (viewport.w > 767) {
          setTimeout(() => {
            $("html").animate(
              { scrollTop: $(window.location.hash).offset().top - 100 },
              1200,
            );
            setTimeout(() => {
              $("html").animate(
                {
                  scrollTop: $(window.location.hash).offset().top - 100,
                },
                1200,
              );
            }, 300);
          }, 1000);
        } else {
          setTimeout(() => {
            $(".body-inner").animate(
              {
                scrollTop: $(window.location.hash).offset().top,
              },
              1200,
              "exponentialEaseOut",
            );
          }, 500);
        }
      } else {
        scrollTop();
      }
    } else if (window.location.search !== "") {
      let searchObj = JSON.parse(
        '{"' +
        decodeURI(location.search.substring(1))
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}',
      );
      if (searchObj.sc) {
        if ($(`#${searchObj.sc}`).length >= 1) {
          let target = `#${searchObj.sc}`;
          if (viewport.w > 767) {
            setTimeout(() => {
              smoothScroll.scrollTo(`#${searchObj.sc}`, {
                offset: -100,
              });
            }, 500);
          } else {
            $(".body-inner").animate(
              {
                scrollTop: $(window.location.hash).offset().top,
              },
              1200,
              "exponentialEaseOut",
            );
          }
          barba.history.add(
            `${window.location.pathname + target}`,
            "barba",
            "replace",
          );
        } else {
          scrollTop();
        }
      }
    } else {
      scrollTop();
    }
  }
  function scrollTop(onComplete) {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    smoothScroll.scrollToTop({
      onComplete: () => {
        onComplete?.();
        getAllScrollTrigger("refresh");
      },
    });
  }
  class Marquee {
    constructor(list, duration = 40) {
      this.list = list;
      this.duration = duration;
    }
    setup(isReverse) {
      console.log()
      let itemClone = this.list.find('[data-marquee="item"]').clone();
      let itemWidth = this.list.find('[data-marquee="item"]').width();
      const cloneAmount = Math.ceil(viewport.w / itemWidth) + 1;
      this.list.html("");
      new Array(cloneAmount).fill().forEach(() => {
        let html = itemClone.clone();
        html.css(
          "animation-duration",
          `${Math.ceil(itemWidth / this.duration)}s`,
        );
        if (isReverse) {
          html.css("animation-direction", "reverse");
        }
        html.addClass("anim-marquee");
        this.list.append(html);
      });
    }
  }
  class SmoothScroll {
    constructor() {
      this.lenis = null;
      this.scroller = {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        velocity: 0,
        direction: 0,
      };
      this.lastScroller = {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        velocity: 0,
        direction: 0,
      };
    }

    init(data) {
      this.reInit(data);

      $.easing.lenisEase = function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      };

      gsap.ticker.add((time) => {
        if (this.lenis) {
          this.lenis.raf(time * 1000);
        }
      });
      gsap.ticker.lagSmoothing(0);
    }

    reInit(data) {
      if (this.lenis) {
        this.lenis.destroy();
      }

      let namespace = data
        ? data.next.namespace
        : $('[data-barba="container"]').attr("data-barba-namespace");

      const CONFIG_INSTANT = {
        lerp: 1,
        duration: 0,
        normalizeWheel: false,
        syncTouch: false,
        smoothWheel: true,
        smoothTouch: false,
        infinite: false,
      };

      this.lenis = new Lenis({
        content: document.documentElement,
        wrapper: document.documentElement,
        ...(viewport.w <= 767 && CONFIG_INSTANT),
      });
      if (viewport.w <= 767) {
        const lenis = this.lenis;
        const bodyInner = document.querySelector(".body-inner");
        ScrollTrigger.scrollerProxy(bodyInner, {
          scrollTop(value) {
            if (arguments.length) {
              lenis.scrollTo(value, { immediate: true, duration: 0 });
            }
            return lenis.scroll;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
        });

        // Config global
        ScrollTrigger.addEventListener("refresh", () => lenis.resize());

        ScrollTrigger.refresh();
        ScrollTrigger.config({ ignoreMobileResize: true });

        ScrollTrigger.defaults({
          scroller: bodyInner,
        });
      }

      // Đồng bộ scroll event
      this.lenis.on("scroll", ScrollTrigger.update);

      this.lenis.on("scroll", (e) => {
        this.updateOnScroll(e);
      });
    }
    reachedThreshold(threshold) {
      if (!threshold) return false;
      const dist = distance(
        this.scroller.scrollX,
        this.scroller.scrollY,
        this.lastScroller.scrollX,
        this.lastScroller.scrollY,
      );

      if (dist > threshold) {
        this.lastScroller = { ...this.scroller };
        return true;
      }
      return false;
    }

    updateOnScroll(e) {
      this.scroller.scrollX = e.scroll;
      this.scroller.scrollY = e.scroll;
      this.scroller.velocity = e.velocity;
      this.scroller.direction = e.direction;

      if (header) {
        header.updateOnScroll(smoothScroll.lenis);
      }
    }

    start() {
      if (this.lenis) {
        this.lenis.start();
      }
      $(".body").css("overflow", "initial");
    }

    stop() {
      if (this.lenis) {
        this.lenis.stop();
      }
      $(".body").css("overflow", "hidden");
    }

    scrollTo(target, options = {}) {
      if (this.lenis) {
        this.lenis.scrollTo(target, options);
      }
    }

    scrollToTop(options = {}) {
      if (this.lenis) {
        this.lenis.scrollTo("top", {
          duration: 0.0001,
          immediate: true,
          lock: true,
          ...options,
        });
      }
    }

    destroy() {
      if (this.lenis) {
        gsap.ticker.remove((time) => {
          this.lenis.raf(time * 1000);
        });
        this.lenis.destroy();
        this.lenis = null;
      }
    }
  }
  const smoothScroll = new SmoothScroll();
  const reinitializeWebflow = (data) => {
    if (!window.Webflow) return;
    console.log("reinitializeWebflow");
    try {
      window.Webflow.destroy();
      window.Webflow.ready();
      const ix2 = window.Webflow.require("ix2");
      if (ix2 && typeof ix2.init === "function") {
        ix2.init();
      }
      const forms = window.Webflow.require("forms");
      if (forms && typeof forms.ready === "function") {
        forms.ready();
      }
      ["slider", "tabs", "dropdown", "navbar"].forEach((module) => {
        try {
          const mod = window.Webflow.require(module);
          if (mod && typeof mod.ready === "function") {
            mod.ready();
          }
        } catch (e) { }
      });
      if (window.Webflow.redraw) {
        window.Webflow.redraw.up();
      }

      if (data) {
        let parser = new DOMParser();
        let dom = parser.parseFromString(data.next.html, "text/html");
        let webflowPageId = $(dom).find("html").attr("data-wf-page");
        $("html").attr("data-wf-page", webflowPageId);
      }
    } catch (e) {
      console.warn("Webflow reinit failed:", e);
    }
  };
  class Mouse {
    constructor() {
      this.mousePos = { x: 0, y: 0 };
      this.cacheMousePos = { ...this.mousePos };
      this.lastMousePos = { ...this.mousePos };
      this.currentSection = null;
      this.normalizeMousePos = {
        current: { x: 0.5, y: 0.5 },
        target: { x: 0.5, y: 0.5 },
      };
      this.cursorRaf = null;
      this.init();

      // Add mouse move event listener
      window.addEventListener("mousemove", (e) => {
        this.mousePos = this.getPointerPos(e);
      });
      window.addEventListener("touchmove", (e) => {
        this.mousePos = this.getPointerPos(e);
      });
    }

    init() {
      if (viewport.w > 991 && !isTouchDevice()) {
        setTimeout(() => {
          this.updateHtml();
        }, 200);
        $(".cursor").addClass("active");
        requestAnimationFrame(this.update.bind(this));
      }
    }
    updateHtml() {
      $('[data-cursor="bg"]').each((idx, el) => {
        if ($(el).find(".bg-dot").length) return;
        let elInner = $(el).find('[data-cursor="inner"]');
        let bg = "--cl-" + ($(el).attr("data-bg") || "white");
        $(el).find('.txt, .heading, [data-hover="arr-ic-main"]').css({
          position: "relative",
          "z-index": "2",
        });
        $(el).find(".ic-embed:not(.ic-arr-main):not(.ic-arr-clone)").css({
          position: "relative",
          "z-index": "2",
        });
        let btnDot = $(document.createElement("div")).addClass("bg-dot");
        let btnDotInner = $(document.createElement("div"))
          .addClass("bg-dot-inner")
          .css("background-color", `var(${bg})`);
        btnDot.append(btnDotInner);
        if (elInner.length) {
          elInner.append(btnDot);
        } else {
          $(el).append(btnDot);
        }
      });
    }
    getSectionAtCursor(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return null;
      const $el = $(el);
      const section = $el.closest("[data-section]");
      const mode = $el.closest("[data-mode]");
      return section.length ? section : (mode.length ? mode : null);
    }
    update() {
      const section = this.getSectionAtCursor(this.mousePos.x, this.mousePos.y);
      this.currentSection = section?.attr("data-section") || section?.attr("data-mode") || null;
      if (viewport.w > 991) {
        if (this.currentSection)
          $(".cursor").attr("data-color", this.currentSection);
        else $(".cursor").removeAttr("data-color");
      }
      this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
      this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

      this.normalizeMousePos.target.x = this.mousePos.x / window.innerWidth;
      this.normalizeMousePos.target.y = this.mousePos.y / window.innerHeight;

      if (!this.cursorRaf) {
        this.cursorRaf = requestAnimationFrame(this.lerpCursorPos.bind(this));
      }
      // this.toggleCursor();
      requestAnimationFrame(this.update.bind(this));
    }

    getPointerPos(ev) {
      if (ev.touches) {
        return {
          x: ev.touches[0].clientX,
          y: ev.touches[0].clientY,
        };
      }
      return {
        x: ev.clientX,
        y: ev.clientY,
      };
    }

    lerpCursorPos = () => {
      this.normalizeMousePos.current.x = lerp(
        this.normalizeMousePos.current.x,
        this.normalizeMousePos.target.x,
        0.1,
      );
      this.normalizeMousePos.current.y = lerp(
        this.normalizeMousePos.current.y,
        this.normalizeMousePos.target.y,
        0.1,
      );

      const delta = distance(
        this.normalizeMousePos.target.x,
        this.normalizeMousePos.current.x,
        this.normalizeMousePos.target.y,
        this.normalizeMousePos.current.y,
      );

      if (delta < 0.001 && this.cursorRaf) {
        cancelAnimationFrame(this.cursorRaf);
        this.cursorRaf = null;
        this.resetCursor();
        return;
      } else {
        this.cursorRaf = requestAnimationFrame(this.lerpCursorPos.bind(this));
        this.toggleCursor();
      }
    };

    reachedThreshold(threshold) {
      if (!threshold) return false;
      const dist = distance(
        this.mousePos.x,
        this.mousePos.y,
        this.lastMousePos.x,
        this.lastMousePos.y,
      );
      if (dist > threshold) {
        this.lastMousePos = { ...this.mousePos };
        return true;
      }
      return false;
    }
    toggleCursor() {
      let gotBtnSize = false;
      const hoverElements = $("[data-cursor]:hover");
      const cursor = $(".cursor");
      const cursorInner = $(".cursor-inner");

      xSetter(cursorInner)(
        this.normalizeMousePos.current.x * window.innerWidth,
      );
      ySetter(cursorInner)(
        this.normalizeMousePos.current.y * window.innerHeight,
      );

      // Get the last hovered element's cursor type (topmost element)
      const type = $(hoverElements[hoverElements.length - 1]).attr(
        "data-cursor",
      );
      switch (type) {
        case "drag":
          cursor.removeClass("hidden");
          cursor.addClass("on-drag");
          break;
        case "control":
          cursor.removeClass("hidden");
          cursor.addClass("on-control");
          break;
        case "hidden":
          cursor.addClass("hidden");
          break;
        case "bg":
          let targetBg;
          targetBg = $('[data-cursor="bg"]:hover');
          if ($("[data-cursor]:hover").hasClass("sm-menu")) {
            gsap.set("html", {
              "--cursor-width": `${targetBg.get(0).getBoundingClientRect().width * 1.6}px`,
              "--cursor-height": `${targetBg.get(0).getBoundingClientRect().height * 1.3}px`,
            });
          } else {
            gsap.set("html", {
              "--cursor-width": `${targetBg.get(0).getBoundingClientRect().width * 1.4}px`,
              "--cursor-height": `${targetBg.get(0).getBoundingClientRect().height * 1.4}px`,
            });
          }
          cursor.addClass("hidden");
          this.targetX =
            targetBg.get(0).getBoundingClientRect().left +
            targetBg.get(0).getBoundingClientRect().width / 2;
          this.targetY =
            targetBg.get(0).getBoundingClientRect().top +
            targetBg.get(0).getBoundingClientRect().height / 2;
          const bgDotEl = targetBg.find(".bg-dot").get(0);
          if (!bgDotEl) break;
          const rect = targetBg.get(0).getBoundingClientRect();
          const targetX = this.mousePos.x - rect.left;
          const targetY = this.mousePos.y - rect.top;
          let bgDotX = gotBtnSize ? xGetter(bgDotEl) : targetX;
          let bgDotY = gotBtnSize ? yGetter(bgDotEl) : targetY;
          if (!gotBtnSize) gotBtnSize = true;
          xSetter(bgDotEl)(lerp(bgDotX, targetX, 0.24));
          ySetter(bgDotEl)(lerp(bgDotY, targetY, 0.24));
          break;
        case "txtLink":
          $(".cursor-inner").addClass("on-hover-sm");
          let targetEl;
          if (
            $("[data-cursor]:hover").attr("data-cursor-txtLink") == "parent"
          ) {
            targetEl = $("[data-cursor]:hover").parent();
          } else if (
            $("[data-cursor]:hover").attr("data-cursor-txtLink") == "child"
          ) {
            targetEl = $("[data-cursor]:hover").find(
              "[data-cursor-txtLink-child]",
            );
          } else {
            targetEl = $("[data-cursor]:hover");
          }

          this.mousePos.x =
            targetEl.get(0).getBoundingClientRect().left -
            $(".cursor-inner").width() / 2 -
            cvUnit(8, "rem");
          this.mousePos.y =
            targetEl.get(0).getBoundingClientRect().top +
            targetEl.get(0).getBoundingClientRect().height / 2;
          $(".cursor-inner").addClass("on-hover-sm");
          break;
        default:
          this.resetCursor();
          break;
      }
    }

    resetCursor() {
      const cursor = $(".cursor");
      // Reset cursor styles
      cursor.removeClass("on-drag");
      cursor.removeClass("hidden");
      cursor.removeClass("on-control");
    }
  }
  const mouse = new Mouse();
  class Loader {
    constructor() {
      this.isLoaded =
        sessionStorage.getItem("isLoaded") === "true" ? true : false;
      this.tlLoadDone = null;
      this.tlLoadMaster = null;
      this.tlLoading = null;
      this.tlCount = null;
      this.tlSlide = null;
      this.tlFirstLoad = null;
      this.tlMove = null;
      this.el = document.querySelector(".loading");
    }
    init(data) {
      if (!this.el) {
        this.devMode(data);
        return;
      }
      this.tlLoading = gsap.timeline({
        paused: true,
        onComplete: () => {
          this.el.classList.add("done");
        },
      });
      this.tlFirstLoad = gsap.timeline({ paused: true });
      this.tlCount = gsap.timeline({ paused: true });
      this.tlSlide = gsap.timeline({ paused: true });
      this.tlMove = gsap.timeline({
        paused: true,
      });
      this.tlLoadMaster = gsap.timeline({
        paused: true,
        delay: this.isLoaded ? 0 : 1,
        duration: 1,
        onStart: () => {
          this.onceSetup(data);
        },
        onComplete: () => {
          this.oncePlay(data);
        },
      });
      if (data.next.namespace == "home") {
        this.tlLoadMaster.to(this.tlFirstLoad, {
          duration: this.tlFirstLoad.totalDuration(),
          progress: 1,
          ease: "none",
        }, "<=0");
        this.tlLoadMaster.to(this.tlCount, {
          duration: this.tlCount.totalDuration(),
          progress: 1,
          ease: "none",
        });
        this.tlLoadMaster.to(this.tlSlide, {
          duration: this.tlSlide.totalDuration(),
          progress: 1,
          ease: "none",
        }, "<");
        this.tlLoadMaster.to(this.tlMove, {
          duration: this.tlMove.totalDuration(),
          progress: 1,
          ease: "none",
        }, "<= 5.8");

        const heroTextTl = gsap.timeline();
        this.tlLoadMaster.add(heroTextTl, "<= 0.3");
      } else {
        this.tlLoadMaster.to(this.tlLoading, {
          duration: this.tlLoading.totalDuration(),
          progress: 1,
          ease: "none",
        });
      }
    }
    play(data) {
      if (!this.el) {
        return;
      }
      this.tlLoadMaster.play();
    }
    devMode(data) {
      this.onceSetup(data);
      this.oncePlay(data);
      $(".loader").remove();
    }
    onceSetup(data) {
      $('body').addClass('over-inherit');
      smoothScroll.stop();
      globalHooks.triggerOnceSetup(data);
    }
    oncePlay(data) {
      $('body').removeClass('over-inherit');
      smoothScroll.start();
      globalHooks.triggerOncePlay(data);
      $(".loader").css("pointer-events", "none");
      sessionStorage.setItem("isLoaded", true);
    }
  }
  const loader = new Loader();

  class GlobalChange {
    constructor() {
      this.namespace = null;
    }
    init(data) {
      this.namespace = data.next.namespace;
      this.refreshOnBreakpoint();
      this.goToTop();
    }
    update(data) {
      header.update(data);
    }
    goToTop() {
      $(document).on("click", ".footer-nav-item", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    refreshOnBreakpoint() {
      const breakpoints = [767, 991];
      const initialViewportWidth =
        viewport.w || document.documentElement.clientWidth;
      const breakpoint =
        breakpoints.find((bp) => initialViewportWidth < bp) ||
        breakpoints[breakpoints.length - 1];
      window.addEventListener(
        "resize",
        debounce(function () {
          const newViewportWidth =
            viewport.w || document.documentElement.clientWidth;
          if (
            (initialViewportWidth < breakpoint &&
              newViewportWidth >= breakpoint) ||
            (initialViewportWidth >= breakpoint &&
              newViewportWidth < breakpoint)
          ) {
            location.reload();
          }
        }),
      );
    }
  }
  const globalChange = new GlobalChange();
  class GlobalHooks {
    constructor() { }
    triggerEvent(eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      data.next.container.dispatchEvent(event);
    }
    triggerOnceSetup(data) {
      console.log("Global Hooks: onceSetup");
      this.triggerEvent("onceSetup", data);
    }
    triggerOncePlay(data) {
      console.log("Global Hooks: oncePlay");
      this.triggerEvent("oncePlay", data);
      requestAnimationFrame(
        () => window.scrollY === 0 && window.scrollTo(0, 1),
      );
    }
    triggerEnterSetup(data) {
      console.log("Global Hooks: enterSetup");
      mouse.init();
      this.triggerEvent("enterSetup", data);
      // Rebuild mouse cursor bindings for newly loaded Barba container
      if (
        typeof mouse !== "undefined" &&
        typeof mouse.updateHtml === "function"
      ) {
        mouse.updateHtml();
      }
      requestAnimationFrame(
        () => window.scrollY === 0 && window.scrollTo(0, 1),
      );
    }
    triggerEnterPlay(data) {
      console.log("Global Hooks: enterPlay");
      this.triggerEvent("enterPlay", data);
    }
  }
  const globalHooks = new GlobalHooks();
  class TriggerSetup {
    constructor() {
      this.tlTrigger = null;
      this.once = true;
    }
    setTrigger(triggerEl, onTrigger) {
      this.tlTrigger = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "clamp(top bottom+=100%)",
          onEnter: () => {
            if (this.once) {
              this.once = false;
              this.onTrigger();
            }
          },
          onEnterBack: () => {
            if (this.once) {
              this.once = false;
              onTrigger();
            }
          },
        },
      });
    }
    cleanTrigger() {
      if (this.isPlayed) {
        this.isPlayed = false;
      }
      if (!this.once) {
        this.once = true;
      }
      if (this.tlTrigger) {
        this.tlTrigger.kill();
        this.tlTrigger = null;
      }
    }
  }

  class Header {
    constructor() {
      this.el = null;
      this.isOpen = false;
      this.listDependent = [];
    }
    init(data) {
      this.el = document.querySelector(".header");
    }
    update(data) {
      this.updateOnScroll(smoothScroll.lenis);
    }
    onHideDependent() {
      let heightHeader = $(this.el).outerHeight();
      if (!$(this.el).hasClass('on-hide')) {
        this.listDependent.forEach((item) => {
          $(item).css('top', heightHeader);
        });
      } else {
        this.listDependent.forEach((item) => {
          $(item).css('top', 0);
        });
      }
    }
    registerDependent(dependentEl) {
      this.listDependent.push(dependentEl);
    }
    unregisterDependent(dependentEl) {
      if (this.listDependent.includes(dependentEl)) {
        this.listDependent = this.listDependent.filter((item) => item !== dependentEl);
      }
    }
    getCurrentSection(attribute, offset = cvUnit(25, "rem")) {
      let sections = $(attribute);
      let matchedSection = null;

      if (sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          let rect = sections[i].getBoundingClientRect();
          if (
            rect.top < $(this.el).height() + offset &&
            rect.bottom -
            $(this.el).height() * 0.5 -
            offset >
            0
          ) {
            matchedSection = sections[i];
          }
        }
      }
      return matchedSection ? $(matchedSection) : null;
    }
    updateOnScroll(inst) {
      this.toggleHide(inst);
      this.toggleScroll(inst);
      this.toggleMode();
      this.onHideDependent();
    }
    toggleScroll(inst) {
      if (inst.scroll > $(this.el).height() * 2)
        $(this.el).addClass("on-scroll");
      else $(this.el).removeClass("on-scroll");
    }
    toggleHide(inst) {
      if (inst.direction == 1) {
        if (inst.scroll > $(this.el).height() * 3) {
          $(this.el).addClass("on-hide");
        }
      } else if (inst.direction == -1) {
        if (inst.scroll > $(this.el).height() * 3) {
          $(this.el).addClass("on-hide");
          $(this.el).removeClass("on-hide");
        }
      }
      else {

      }
    }
    toggleMode() {
      let mode = this.getCurrentSection("[data-section]")?.attr("data-section");
      const currentClasses = $(this.el).attr("class") || "";
      const onModeClasses = currentClasses
        .split(" ")
        .filter(
          (cls) =>
            cls.startsWith("on-") &&
            cls !== "on-scroll" &&
            cls !== "on-hide"
        );
      onModeClasses.forEach((cls) => {
        $(this.el).removeClass(cls);
      });

      if (mode) {
        $(this.el).attr("data-mode", mode);
      } else {
        $(this.el).removeAttr("data-mode");
      }
    }
  }
  const header = new Header();
  const HomePage = {
    Intro: class extends TriggerSetup {
      constructor() {
        super();
        this.el = null;
        this.introTl = null;
        this.introImgTl = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_intro_wrap');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        // GSAP register
        gsap.registerPlugin(ScrollTrigger);

        // ── home_intro_main: horizontal scroll panel ──
        this.introTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.home_intro_wrap',
            start: 'top+=5% top',
            end: () => `bottom bottom`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        this.introTl.to('.home_intro_main', {
          x: () => -viewport.w * 1.3,
          ease: 'none',
        });

        this.introImgTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.home_intro_wrap',
            start: `top+=10% top`,
            end: `bottom bottom`,
            invalidateOnRefresh: true,
            scrub: true
          }
        });

        this.introImgTl
          .to('.home_intro_img_list:nth-child(1)', {
            x: '-=90%',
            ease: 'none',
          }, 0)
          .to('.home_intro_img_list:nth-child(2)', {
            x: '+=90%',
            ease: 'none',
          }, 0)
          .to('.home_intro_img_list:nth-child(3)', {
            x: '-=60%',
            ease: 'none',
          }, 0)
          .to('.home_intro_img_list:nth-child(4)', {
            x: '+=80%',
            ease: 'none',
          }, 0);
      }
      destroy() {
        super.cleanTrigger();
        if (this.introTl) this.introTl.kill();
        if (this.introImgTl) this.introImgTl.kill();
      }
    },
    Clients: class extends TriggerSetup {
      constructor() {
        super();
        this.tabClickHandler = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_clients');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        // Initialize home clients tabs
        console.log('trigger home_clients');
        let activeTab = $('.home_clients_tab_item.active').attr('data-tabs');
        if (activeTab) {
          $('.home_clients_content_item').hide();
          $('.home_clients_content_item[data-tabs="' + activeTab + '"]').css('display', 'flex');
        }

        this.tabClickHandler = function () {
          if ($(this).hasClass('active')) return;

          $('.home_clients_tab_item').removeClass('active');
          $(this).addClass('active');

          let tabId = $(this).attr('data-tabs');

          $('.home_clients_content_item').hide();
          $('.home_clients_content_item[data-tabs="' + tabId + '"]').css('display', 'flex').hide().fadeIn(300);
        };

        $('.home_clients_tab_item').on('click', this.tabClickHandler);
      }
      destroy() {
        super.cleanTrigger();
        if (this.tabClickHandler) {
          $('.home_clients_tab_item').off('click', this.tabClickHandler);
        }
      }
    },
    Services: class extends TriggerSetup {
      constructor() {
        super();
        this.el = null;
        this.servicesTl = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_services_cms_wrap');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        gsap.registerPlugin(ScrollTrigger);

        const items = this.el.querySelectorAll('.home_services_item');
        const itemCount = items.length;
        if (itemCount === 0) return;

        // Set dynamic height on wrapper (100dvh per item)
        this.el.style.height = `${itemCount * 100}dvh`;

        this.servicesTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.el,
            start: 'top+=6% top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set('.home_services_progress', { width: `${self.progress * 100}%` });
            }
          }
        });

        items.forEach((item, index) => {
          // Dynamic z-index (higher item = higher z-index)
          item.style.zIndex = index + 1;

          // Animating slides 2, 3, etc.
          if (index > 0) {
            this.servicesTl.to(item, {
              width: '100vw',
              ease: 'none',
            });
          }
        });
      }
      destroy() {
        super.cleanTrigger();
        if (this.servicesTl) this.servicesTl.kill();
      }
    },
    Specialize: class extends TriggerSetup {
      constructor() {
        super();
        this.el = null;
        this.spans = [];
        this.splits = [];
        this.timer = null;
        this.currentIndex = 0;
        this.isAnimating = false;
      }
      trigger(data) {
        this.el = document.querySelector('.home_specialize_wrap');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        this.setup();
        this.animFade();
        this.animScrub();
      }

      setup() {
        this.spans = Array.from(this.el.querySelectorAll('.home_specialize_inner_txt.main span'));
        if (this.spans.length === 0) return;

        // Hide all spans initially except the first one, and split their characters
        this.spans.forEach((span, index) => {
          span.style.display = 'inline-block';

          const childSplit = new SplitText(span, { type: 'chars' });
          const parentSplit = new SplitText(span, { type: 'chars', charsClass: 'char-mask' });

          this.splits.push({ child: childSplit, parent: parentSplit });

          // Initially hide characters of all spans
          gsap.set(childSplit.chars, { yPercent: 100 });
          // Ensure the span itself is fully opaque now that GSAP handles overflow/visibility
          gsap.set(span, { opacity: 1 });
        });

        // Animate the first span's characters into view
        const firstSplit = this.splits[0];
        gsap.set(firstSplit.child.chars, { yPercent: 0 });
      }
      animFade() {
        // Start the autonomous auto-play text rotation loop
        this.startLoop();
      }
      animScrub() {
        // Find parallax and rotating elements inside the sticky section
        const topDeco = this.el.querySelector('.home_specialize_bg_deco_item.top');
        const centerDeco = this.el.querySelector('.home_specialize_bg_deco_item.center');
        const bottomDeco = this.el.querySelector('.home_specialize_bg_deco_item.bottom');
        const bgColor = this.el.querySelector('.home_specialize_bg_color_inner');

        // Create a scroll-scrubbed timeline tied to the sticky scroll container
        this.scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.el,
            start: 'top top',
            end: `bottom-=${viewport.h}px bottom`,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });

        if (topDeco) {
          this.scrubTl.to(topDeco, {
            autoAlpha: 0,
            yPercent: -4,
            ease: 'none'
          }, 0);
        }
        if (bottomDeco) {
          this.scrubTl.to(bottomDeco, {
            autoAlpha: 0,
            yPercent: 4,
            ease: 'none'
          }, 0);
        }
        if (centerDeco) {
          this.scrubTl.to(centerDeco, {
            autoAlpha: 0,
            xPercent: -6,
            ease: 'none'
          }, 0);
        }
        if (bgColor) {
          this.scrubTl.to(bgColor, {
            scaleX: () => {
              const vw = window.innerWidth;
              const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
              const paddingContainerStr = getComputedStyle(document.documentElement).getPropertyValue('--padding-container').trim() || '6.5rem';
              const paddingValue = parseFloat(paddingContainerStr);
              const gap = paddingContainerStr.endsWith('rem') ? paddingValue * rootFontSize : paddingValue;
              return (vw - 2 * gap) / vw;
            },
            scaleY: () => {
              const vh = window.innerHeight;
              const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
              const paddingContainerStr = getComputedStyle(document.documentElement).getPropertyValue('--padding-container').trim() || '6.5rem';
              const paddingValue = parseFloat(paddingContainerStr);
              const gap = paddingContainerStr.endsWith('rem') ? paddingValue * rootFontSize : paddingValue;
              return (vh - 2 * gap) / vh;
            },
            ease: 'none',
            transformOrigin: "center center",
          }, 0.4);
        }
      }
      startLoop() {
        this.timer = setInterval(() => {
          this.next();
        }, 3000); // 3 seconds interval
      }
      next() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const nextIndex = (this.currentIndex + 1) % this.spans.length;
        const currentSplit = this.splits[this.currentIndex];
        const nextSplit = this.splits[nextIndex];

        // Ensure next characters are prepared at yPercent: 100 before animating
        gsap.set(nextSplit.child.chars, { yPercent: 100 });

        const tl = gsap.timeline({
          onComplete: () => {
            this.currentIndex = nextIndex;
            this.isAnimating = false;
          }
        });

        // 1. Current active characters: animate to -100% (exit)
        tl.to(currentSplit.child.chars, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power2.inOut',
          stagger: 0.02
        }, 0);

        // 2. Next active characters: animate to 0% (entrance)
        tl.to(nextSplit.child.chars, {
          yPercent: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          stagger: 0.02
        }, 0.15);
      }
      destroy() {
        super.cleanTrigger();
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        if (this.scrubTl) {
          this.scrubTl.kill();
          this.scrubTl = null;
        }
        this.splits.forEach(split => {
          if (split.child) split.child.revert();
          if (split.parent) split.parent.revert();
        });
        this.splits = [];
      }
    }
  };

  const OurClientPage = {
    Clients: class extends TriggerSetup {
      constructor() {
        super();
        this.tabClickHandler = null;
        this.observer = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_clients');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        this.tabClickHandler = function () {
          if ($(this).hasClass('active')) return;

          $('.home_clients_tab_item').removeClass('active');

          let tabId = $(this).attr('data-tabs');
          $('.home_clients_tab_item[data-tabs="' + tabId + '"]').addClass('active');

          $('.home_clients_content_item').hide();
          $('.home_clients_content_item[data-tabs="' + tabId + '"]').css('display', 'flex').hide().fadeIn(300);
        };

        $('.home_clients_tab_item').on('click', this.tabClickHandler);

        const topTab = document.querySelector(".home_clients_tab:not(.bottom)");
        const bottomTab = document.querySelector(".home_clients_tab.bottom");

        if (topTab && bottomTab) {
          // Initially hide the bottom tab if the top tab is visible
          this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Top tab is visible, hide bottom tab
                bottomTab.style.opacity = "0";
                bottomTab.style.pointerEvents = "none";
              } else {
                // Top tab is scrolled out of view, show bottom tab
                bottomTab.style.opacity = "1";
                bottomTab.style.pointerEvents = "auto";
              }
            });
          }, {
            // Trigger as soon as top tab is 100% out of view
            threshold: 0
          });

          this.observer.observe(topTab);
        }
      }
      destroy() {
        super.cleanTrigger();
        if (this.tabClickHandler) {
          $('.home_clients_tab_item').off('click', this.tabClickHandler);
        }
        if (this.observer) {
          this.observer.disconnect();
        }
      }
    }
  };

  const AboutUsPage = {};
  const CareerPage = {};
  const CareerDetailPage = {};
  const CaseStudyPage = {};
  const CaseStudyDetailPage = {};
  const ContactPage = {};
  const ServicePage = {};

  class PageManager {
    constructor(page) {
      this.sections = Object.values(page).map((section) => new section());

      this.boundSetupHandler = this.setupHandler.bind(this);
      this.boundOncePlayHandler = this.oncePlayHandler.bind(this);
      this.boundEnterPlayHandler = this.enterPlayHandler.bind(this);
    }

    initOnce(data) {
      const container = data.next.container;
      console.log("initOnce", container);
      container.addEventListener("onceSetup", (event) => {
        this.boundSetupHandler({ detail: event.detail, mode: "once" });
      });
      container.addEventListener("oncePlay", this.boundOncePlayHandler);
    }

    initEnter(data) {
      const container = data.next.container;
      console.log("initEnter", container);
      container.addEventListener("enterSetup", (event) => {
        this.boundSetupHandler({ detail: event.detail, mode: "enter" });
      });
      container.addEventListener("enterPlay", this.boundEnterPlayHandler);
    }

    oncePlayHandler(event) {
      this.sections.forEach((section) => {
        if (section.playOnce) {
          section.playOnce(event.detail);
        }
      });
    }

    enterPlayHandler(event) {
      this.sections.forEach((section) => {
        if (section.playEnter) {
          section.playEnter(event.detail);
        }
      });
    }

    setupHandler(event) {
      const data = event.detail;
      const mode = event.mode;
      this.sections.forEach((section) => {
        if (section.trigger) {
          section.trigger(data);
        }
        if (typeof section.setup === "function" && section.setup.length > 0) {
          section.setup(data, mode);
        }
      });
    }

    destroy(data) {
      const container = data.next.container;
      container.removeEventListener("onceSetup", this.boundSetupHandler);
      container.removeEventListener("oncePlay", this.boundOncePlayHandler);
      container.removeEventListener("enterSetup", this.boundSetupHandler);
      container.removeEventListener("enterPlay", this.boundEnterPlayHandler);

      this.sections.forEach((section) => {
        if (section.destroy) {
          section.destroy();
        }
        if (section.cleanTrigger) {
          section.cleanTrigger();
        }
      });
    }
  }

  class HomePageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class OurClientPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class AboutUsPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class CareerPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class CareerDetailPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class CaseStudyPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class CaseStudyDetailPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class ContactPageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }
  class ServicePageManager extends PageManager {
    constructor(page) {
      super(page);
    }
  }

  const PageManagerRegistry = {
    home: new HomePageManager(HomePage),
    ourClient: new OurClientPageManager(OurClientPage),
    aboutus: new AboutUsPageManager(AboutUsPage),
    career: new CareerPageManager(CareerPage),
    careerDetail: new CareerDetailPageManager(CareerDetailPage),
    caseStudy: new CaseStudyPageManager(CaseStudyPage),
    caseStudyDetail: new CaseStudyDetailPageManager(CaseStudyDetailPage),
    contact: new ContactPageManager(ContactPage),
    service: new ServicePageManager(ServicePage),
  };

  const getNamespace = () => {
    let ns = $(".main").attr("data-namespace");
    return ns || "home";
  };

  // Direct initialization on DOM Ready without Barba.js
  $(document).ready(() => {
    const namespace = getNamespace();
    const data = {
      next: {
        container: document.querySelector('.main-inner') || document.body,
        namespace: namespace
      }
    };

    // 1. Initialize global and page lifecycle utilities
    smoothScroll.init(data);
    globalChange.init(data);

    if (typeof documentHeightObserver === "function") {
      documentHeightObserver("init", data);
    }

    // 2. Initialize corresponding page manager
    const pageManager = PageManagerRegistry[namespace];
    if (pageManager) {
      pageManager.initOnce(data);
    }

    // 3. Initialize and play loader
    loader.init(data);
    loader.play(data);
    resetScroll(data);
    header.init(data);
  });
};
window.onload = mainScript;
