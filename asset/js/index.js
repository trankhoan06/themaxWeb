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
            start: 'top top+=70%',
            end: '+=100%',
            scrub: false,
            once: true,
            ...this.scrollTrigger
          }
        })
      };
      this.tweenArr.forEach((item) => this.timeline.add(item.animation, item.delay || `<=${this.stagger}` || "<=.1"));
    }
    destroy() {
      this.timeline.kill();
      this.tweenArr.forEach((item) => item.destroy?.());
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
    constructor({ el, delay, headingType, splitType, duration, stagger, isDisableRevert, isDisableAnim, ...props }) {
      if (!el || el.textContent === '') return;
      this.DOM = { el: el };
      this.delay = delay;
      this.textSplit = null;
      this.splitType = splitType || 'words';
      this.headingType = headingType || 'false';
      this.duration = duration || .8;
      this.stagger = stagger || .02;
      let animation;
      document.fonts.ready.then(() => {
        this.textSplit = SplitText.create(this.DOM.el, {
          type: this.splitType === 'chars' ? "lines words chars" : (this.splitType === 'words' ? "lines words" : 'lines'),
          mask: "lines",
          linesClass: headingType ? 'bp-line heading-line' : 'bp-line',
          autoSplit: true,
          onSplit: (self) => {
            const computedStyle = window.getComputedStyle(self.elements[0]);



            const bgImage = computedStyle.backgroundImage;
            const hasGradient = bgImage && bgImage !== 'none' && bgImage.includes('gradient');
            if (hasGradient) {
              const parentRect = self.elements[0].getBoundingClientRect();
              const parentWidth = parentRect.width;
              self[this.splitType].forEach(child => {
                const childRect = child.getBoundingClientRect();
                const offsetX = childRect.left - parentRect.left;
                child.style.backgroundImage = bgImage;
                child.style.backgroundSize = `${parentWidth}px 100%`;
                child.style.backgroundPosition = `-${offsetX}px 0px`;
                child.style.webkitBackgroundClip = 'text';
                child.style.webkitTextFillColor = 'transparent';
                child.style.backgroundClip = 'text';
              });
            }
            if (isDisableAnim) {
              gsap.set(self[this.splitType], { autoAlpha: 1, yPercent: 100 });
              return;
            }
            gsap.set(self[this.splitType], { autoAlpha: 0, yPercent: 100 });
            const hasTranslate = self.elements[0].classList.contains('item_translate');
            if (hasTranslate) {
              gsap.set(self.elements[0], { x: 0 });
              const tl = gsap.timeline();
              tl.to(self[this.splitType], {
                autoAlpha: 1,
                yPercent: 0,
                stagger: this.stagger,
                duration: this.duration,
                ease: 'power2.out',
                ...props
              });
              tl.to(self.elements[0], {
                x: 100,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => {
                  if (!isDisableRevert) {
                    self.revert();
                    convertHyphenDOM(self.elements[0]);
                  }
                }
              }, ">-=0.2");
              animation = tl;
            } else {
              animation = gsap.to(self[this.splitType], {
                autoAlpha: 1,
                yPercent: 0,
                stagger: this.stagger,
                duration: this.duration,
                ease: 'power2.out',
                onComplete: () => {
                  if (!isDisableRevert) {
                    self.revert();
                    convertHyphenDOM(self.elements[0]);
                  }
                },
                ...props
              });
            }
          }
        });
        this.animation = animation;
      })
    }
    init() {
      document.fonts.ready.then(() => {

      })
    }
    destroy() {
      if (this.animation) this.animation.kill();
      if (this.textSplit) this.textSplit.revert();
    }
  }

  class TextTypewriter {
    constructor({ el, delay, ...props }) {
      this.DOM = { el: el };
      this.delay = delay;
      document.fonts.ready.then(() => {
        gsap.set(this.DOM.el, { height: this.DOM.el.offsetHeight });
        this.animation = gsap.from(this.DOM.el, {
          text: {
            value: "",
            speed: 3,
            ...props
          },
          clearProps: 'all',
        });;
      })
    }
    init() {
    }
    stop() {
    }
    destroy() {
      this.animation.kill();
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
        none: {
          set: { opacity: 0, ...from },
          to: { opacity: 1, ...to }
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
          clearProps: 'all',
          ...props
        });
    }
    init() {
      if (!this.DOM.el) return;
      gsap.set(this.DOM.el, { ...this.options[this.type]?.set || this.options.default.set });
    }
    destroy() {
      this.animation.kill();
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
          ease: 'none',
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
  class ScaleInset {
    constructor({ el, delay, duration, isDisableRevert, onComplete }) {
      this.DOM = {
        el: el
      };
      this.delay = delay;
      const animationProps = {
        scale: 1,
        duration: 1.6,
        autoAlpha: 1,
        ease: 'expo.out',
        clearProps: isDisableRevert ? '' : 'all',
        overwrite: true
      };
      if (onComplete) {
        animationProps.onComplete = onComplete;
      }
      this.animation = gsap
        .timeline()
        .to(this.DOM.el, animationProps)
    }
    init() {
      if (!this.DOM.el) return;
      gsap.set(this.DOM.el, { scale: 1.25, autoAlpha: 0 });
    }
    destroy() {
      this.animation.kill();
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
      $(document).on("click", ".footer-nav-item, .btn_top", (e) => {
        e.preventDefault();
        if (typeof smoothScroll !== "undefined" && smoothScroll.lenis) {
          smoothScroll.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        $('.header').removeClass('on-hide');
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
      if (!this.el) return;
      gsap.fromTo('.header .container', { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, clearProps: 'all' });
      const menuBtn = this.el.querySelector(".header_menu_inner");
      const menuNav = this.el.querySelector(".header_menu_nav");

      if (menuBtn && menuNav) {
        menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          menuBtn.classList.toggle("active");
          menuNav.classList.toggle("active");
          this.isOpen = menuBtn.classList.contains("active");
        });

        document.addEventListener("click", (e) => {
          if (this.isOpen && !menuNav.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove("active");
            menuNav.classList.remove("active");
            this.isOpen = false;
          }
        });
      }
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
      if (inst.scroll < $(this.el).height() * 3) {
        $(this.el).removeClass("on-hide");
      } else {
        if (inst.direction == 1) {
          $(this.el).addClass("on-hide");
        } else if (inst.direction == -1) {
          $(this.el).removeClass("on-hide");
        }
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

  class Footer {
    constructor() {
      this.el = null;
      this.fadeTl = null;
      this.master = null;
      this.menuItemsFade = null;
      this.emailFade = null;
      this.addressFade = null;
      this.formFade = null;
      this.botFade = null;
    }
    init(data) {
      this.el = document.querySelector("footer");
      if (!this.el) return;
      this.setup();
      this.animFade();
    }
    setup() {
      this.menuItems = this.el.querySelectorAll('.footer_top_menu_item');
      this.email = this.el.querySelector('.footer_top_email');
      this.addresses = this.el.querySelectorAll('.footer_content_address');
      this.form = this.el.querySelector('.footer_content_form');
      this.bot = this.el.querySelector('.footer_bot');

      if (this.menuItems.length > 0) {
        this.menuItemsFade = new FadeIn({ el: this.menuItems, type: 'bottom', isDisableRevert: true, stagger: 0.1 });
      }
      if (this.email) {
        this.emailFade = new FadeIn({ el: this.email, type: 'bottom', isDisableRevert: true });
      }
      if (this.addresses.length > 0) {
        this.addressFade = new FadeIn({ el: this.addresses, type: 'bottom', isDisableRevert: true, stagger: 0.1 });
      }
      if (this.form) {
        this.formFade = new FadeIn({ el: this.form, type: 'bottom', isDisableRevert: true });
      }
      if (this.bot) {
        this.botFade = new FadeIn({ el: this.bot, type: 'bottom', isDisableRevert: true });
      }
    }
    animFade() {
      this.fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: this.el,
          start: 'top bottom-=50px',
          once: true
        }
      });

      const tweenArr = [];
      if (this.menuItemsFade) tweenArr.push(this.menuItemsFade);
      if (this.emailFade) tweenArr.push(this.emailFade);
      if (this.addressFade) tweenArr.push(this.addressFade);
      if (this.formFade) tweenArr.push(this.formFade);
      if (this.botFade) tweenArr.push(this.botFade);

      this.master = new MasterTimeline({
        timeline: this.fadeTl,
        triggerInit: this.el,
        tweenArr: tweenArr
      });
    }
    destroy() {
      if (this.fadeTl) {
        this.fadeTl.kill();
        this.fadeTl = null;
      }
      if (this.master) {
        this.master.destroy();
        this.master = null;
      }
      if (this.menuItemsFade) {
        this.menuItemsFade.destroy();
        this.menuItemsFade = null;
      }
      if (this.emailFade) {
        this.emailFade.destroy();
        this.emailFade = null;
      }
      if (this.addressFade) {
        this.addressFade.destroy();
        this.addressFade = null;
      }
      if (this.formFade) {
        this.formFade.destroy();
        this.formFade = null;
      }
      if (this.botFade) {
        this.botFade.destroy();
        this.botFade = null;
      }
    }
  }
  const footer = new Footer();

  class ButtonTop {
    constructor() {
      this.el = null;
      this.triggerST = null;
    }
    init() {
      this.el = document.querySelector(".btn_top");
      if (!this.el) return;

      const firstSection = document.querySelector('main section') || document.querySelector('.home_hero');
      if (firstSection) {
        this.triggerST = ScrollTrigger.create({
          trigger: firstSection,
          start: "bottom top",
          onEnter: () => this.el.classList.add("active"),
          onLeaveBack: () => this.el.classList.remove("active")
        });
      } else {
        this.triggerST = ScrollTrigger.create({
          start: "top+=300 top",
          onUpdate: (self) => {
            if (self.scroll() > 300) {
              this.el.classList.add("active");
            } else {
              this.el.classList.remove("active");
            }
          }
        });
      }
    }
    destroy() {
      if (this.triggerST) {
        this.triggerST.kill();
        this.triggerST = null;
      }
    }
  }
  const buttonTop = new ButtonTop();

  const HomePage = {
    Hero: class {
      constructor() {
        this.el = null;
        this.tlFade = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_hero');
        if (!this.el) return;
        this.setup();
        this.animFade();
        this.animScrub();
      }
      setup() {
      }
      animFade() {
        this.tlFade = gsap.timeline();
        new MasterTimeline({
          timeline: this.tlFade,
          triggerInit: this.el,
          tweenArr: [
            new FadeSplitText({ el: this.el.querySelector('.home_hero_overlay_txt') }),
            new FadeIn({ el: this.el.querySelector('.home_hero_overlay_icon'), type: 'none' }),
          ]
        })
      }
      animScrub() {
      }
      destroy() {
        if (this.tlFade) {
          this.tlFade.kill();
          this.tlFade = null;
        }
        if (this.entranceTl) {
          this.entranceTl.kill();
          this.entranceTl = null;
        }
      }
    },
    Intro: class extends TriggerSetup {
      constructor() {
        super();
        this.el = null;
        this.introTl = null;
        this.introImgTl = null;
        this.tlFade = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_intro_wrap');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        this.setup();
        this.animFade();
        this.animScrub();
      }
      setup() {
      }
      animFade() {
        this.tlFade = gsap.timeline({
          scrollTrigger: {
            trigger: '.home_intro_inner',
            start: 'top top+=75%',
          }
        });

        new MasterTimeline({
          timeline: this.tlFade,
          triggerInit: this.el,
          tweenArr: [
            ...Array.from($(this.el).find('.home_intro_txt')).flatMap((item) => [
              new FadeSplitText({ el: $(item).get(0), splitType: 'chars' }),
            ]),
            new FadeSplitText({ el: this.el.querySelector('.home_intro_subtxt_inner') })
          ]
        })
      }
      animScrub() {
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
        this.el = null;
        this.tabClickHandler = null;
        this.fadeTl = null;
        this.master = null;
        this.contentTl = null;
        this.contentMaster = null;
        this.subFade = null;
        this.titleSplit = null;
        this.tabItemsFade = null;
        this.logosFade = null;
        this.btnFade = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_clients');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        this.setup();
        this.animFade();
        this.animScrub();
        this.interact();
      }
      setup() {
        // Initialize home clients tabs
        let activeTab = $('.home_clients_tab_item.active').attr('data-tabs');
        if (activeTab) {
          $('.home_clients_content_item').hide();
          $('.home_clients_content_item[data-tabs="' + activeTab + '"]').css('display', 'flex');
        }

        this.subtitle = this.el.querySelector('.home_clients_subtitle');
        this.title = this.el.querySelector('.home_clients_title');
        this.tabItems = this.el.querySelectorAll('.home_clients_tab_item');
        this.logos = this.el.querySelectorAll('.home_clients_content_item_img');
        this.btn = this.el.querySelector('.home_clients_button');

        if (this.subtitle) {
          this.subFade = new FadeIn({ el: this.subtitle, type: 'bottom', isDisableRevert: true });
        }
        if (this.title) {
          this.titleSplit = new FadeSplitText({ el: this.title, splitType: 'chars' });
        }
        if (this.tabItems.length > 0) {
          this.tabItemsFade = new FadeIn({ el: this.tabItems, type: 'bottom', isDisableRevert: true, stagger: 0.1 });
        }
        if (this.logos.length > 0) {
          this.logosFade = new FadeIn({ el: this.logos, type: 'bottom', isDisableRevert: true, stagger: 0.05 });
        }
        if (this.btn) {
          this.btnFade = new FadeIn({ el: this.btn, type: 'bottom', isDisableRevert: true, delay: 1 });
        }
      }
      interact() {
        this.tabClickHandler = function () {
          if ($(this).hasClass('active')) return;

          $('.home_clients_tab_item').removeClass('active');
          $(this).addClass('active');

          let tabId = $(this).attr('data-tabs');

          $('.home_clients_content_item').hide();
          
          const $target = $('.home_clients_content_item[data-tabs="' + tabId + '"]');
          $target.css('display', 'flex');

          const targetLogos = $target.find('.home_clients_content_item_img').get();
          if (targetLogos.length > 0) {
            gsap.fromTo(targetLogos,
              { opacity: 0, y: 15 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.03,
                clearProps: 'all'
              }
            );
          }
        };

        $('.home_clients_tab_item').on('click', this.tabClickHandler);
      }
      animFade() {
        // 1. Header Timeline (subtitle, title, tab items)
        this.fadeTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.subtitle || this.el,
            start: 'top top+=75%',
            once: true
          }
        });

        const tweenArr = [];
        if (this.subFade) tweenArr.push(this.subFade);
        if (this.titleSplit) tweenArr.push(this.titleSplit);
        if (this.tabItemsFade) tweenArr.push(this.tabItemsFade);

        this.master = new MasterTimeline({
          timeline: this.fadeTl,
          triggerInit: this.subtitle || this.el,
          tweenArr: tweenArr
        });

        // 2. Content Timeline (logo grid + button)
        const contentArea = this.el.querySelector('.home_clients_content');
        if (contentArea && this.logosFade) {
          this.contentTl = gsap.timeline({
            scrollTrigger: {
              trigger: contentArea,
              start: 'top top+=75%',
              once: true
            }
          });

          const contentTweenArr = [this.logosFade];
          if (this.btnFade) contentTweenArr.push(this.btnFade);

          this.contentMaster = new MasterTimeline({
            timeline: this.contentTl,
            triggerInit: contentArea,
            tweenArr: contentTweenArr
          });
        }
      }
      animScrub() { }
      destroy() {
        super.cleanTrigger();
        if (this.tabClickHandler) {
          $('.home_clients_tab_item').off('click', this.tabClickHandler);
        }
        if (this.fadeTl) {
          this.fadeTl.kill();
          this.fadeTl = null;
        }
        if (this.master) {
          this.master.destroy();
          this.master = null;
        }
        if (this.contentTl) {
          this.contentTl.kill();
          this.contentTl = null;
        }
        if (this.contentMaster) {
          this.contentMaster.destroy();
          this.contentMaster = null;
        }
        if (this.subFade) {
          this.subFade.destroy();
          this.subFade = null;
        }
        if (this.titleSplit) {
          this.titleSplit.destroy();
          this.titleSplit = null;
        }
        if (this.tabItemsFade) {
          this.tabItemsFade.destroy();
          this.tabItemsFade = null;
        }
        if (this.logosFade) {
          this.logosFade.destroy();
          this.logosFade = null;
        }
        if (this.btnFade) {
          this.btnFade.destroy();
          this.btnFade = null;
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
        this.el = document.querySelector('.home_services');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        this.setup();
        this.animFade();
        this.animScrub();
      }
      setup() {
        gsap.registerPlugin(ScrollTrigger);

        const cmsWrap = this.el.querySelector('.home_services_cms_wrap');
        const items = this.el.querySelectorAll('.home_services_item');
        const itemCount = items.length;
        if (cmsWrap && itemCount > 0) {
          cmsWrap.style.height = `${itemCount * 100}dvh`;
        }

        items.forEach((item, index) => {
          // Dynamic z-index (higher item = higher z-index)
          item.style.zIndex = index + 1;
        });

        // Query the elements for the top title split & fadein
        this.sub = this.el.querySelector('.home_services_sub');
        this.title = this.el.querySelector('.home_services_title');
        this.bgItems = this.el.querySelectorAll('.home_services_top_bg');

        // Create FadeSplitText
        if (this.sub) {
          this.subFade = new FadeIn({ el: this.sub, type: 'bottom', isDisableRevert: true });
        }
        if (this.title) {
          this.fadeSplitTitle = new FadeSplitText({ el: this.title, splitType: 'chars' });
        }

        // Create FadeIn for top background SVGs
        if (this.bgItems.length > 0) {
          this.bgFade = new FadeIn({
            el: this.bgItems,
            type: 'none',
            isDisableRevert: true,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power2.out',
            from: { scale: 0.95 },
            to: { scale: 1 },
            delay: 0
          });
        }

        // Setup for the first item inside cms wrap
        if (items.length > 0) {
          this.firstItemInner = items[0].querySelector('.home_services_item_inner');
          if (this.firstItemInner) {
            const firstTitle = this.firstItemInner.querySelector('.home_services_content_title');
            this.firstSub = this.firstItemInner.querySelector('.home_services_content_sub');
            this.firstDes = this.firstItemInner.querySelector('.home_services_content_bottom_des');
            this.firstListItems = this.firstItemInner.querySelectorAll('.home_services_content_bottom_list_item');
            this.firstImg = this.firstItemInner.querySelector('.home_services_img img');

            // Initialize split text for the first slide's title
            if (firstTitle) {
              this.firstTitleSplit = new FadeSplitText({ el: firstTitle, splitType: 'chars' });
            }
            if (this.firstImg) {
              this.firstImgAnim = new ScaleInset({ el: this.firstImg, isDisableRevert: true });
            }
            if (this.firstSub) {
              this.firstSubFade = new FadeIn({
                el: this.firstSub,
                type: 'bottom',
                isDisableRevert: true,
              });
            }
            if (this.firstDes) {
              this.firstDesFade = new FadeIn({
                el: this.firstDes,
                type: 'bottom',
                isDisableRevert: true,
              });
            }
            if (this.firstListItems.length > 0) {
              this.firstListItemsFade = new FadeIn({
                el: this.firstListItems,
                type: 'bottom',
                isDisableRevert: true,
                stagger: 0.08,
              });
            }
          }
        }
      }
      animFade() {
        this.fadeTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.el.querySelector('.home_services_top') || this.el,
            start: 'top top+=80%',
            once: true,
          }
        });

        const tweenArr = [];
        if (this.subFade) tweenArr.push(this.subFade);
        if (this.fadeSplitTitle) tweenArr.push(this.fadeSplitTitle);
        if (this.bgFade) tweenArr.push(this.bgFade);

        this.master = new MasterTimeline({
          timeline: this.fadeTl,
          triggerInit: this.el.querySelector('.home_services_top') || this.el,
          tweenArr: tweenArr
        });

        // 2. Separate scroll-trigger timeline for the first item content
        const cmsWrap = this.el.querySelector('.home_services_cms_wrap');
        if (this.firstItemInner && cmsWrap) {
          this.firstItemTl = gsap.timeline({
            scrollTrigger: {
              trigger: cmsWrap,
              start: 'top top+=65%',
              once: true
            }
          });

          const firstTweenArr = [];
          if (this.firstTitleSplit) firstTweenArr.push(this.firstTitleSplit);
          if (this.firstImgAnim) firstTweenArr.push(this.firstImgAnim);
          if (this.firstSubFade) firstTweenArr.push(this.firstSubFade);
          if (this.firstDesFade) firstTweenArr.push(this.firstDesFade);
          if (this.firstListItemsFade) firstTweenArr.push(this.firstListItemsFade);

          this.firstItemMaster = new MasterTimeline({
            timeline: this.firstItemTl,
            triggerInit: cmsWrap,
            tweenArr: firstTweenArr
          });
        }
      }
      animScrub() {
        const cmsWrap = this.el.querySelector('.home_services_cms_wrap');
        if (!cmsWrap) return;
        const items = cmsWrap.querySelectorAll('.home_services_item');
        if (items.length === 0) return;

        this.servicesTl = gsap.timeline({
          scrollTrigger: {
            trigger: cmsWrap,
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
        if (this.servicesTl) {
          this.servicesTl.kill();
          this.servicesTl = null;
        }
        if (this.fadeTl) {
          this.fadeTl.kill();
          this.fadeTl = null;
        }
        if (this.master) {
          this.master.destroy();
          this.master = null;
        }
        if (this.subFade) {
          this.subFade.destroy();
          this.subFade = null;
        }
        if (this.fadeSplitTitle) {
          this.fadeSplitTitle.destroy();
          this.fadeSplitTitle = null;
        }
        if (this.bgFade) {
          this.bgFade.destroy();
          this.bgFade = null;
        }

        // Clean up first item animations
        if (this.firstItemTl) {
          this.firstItemTl.kill();
          this.firstItemTl = null;
        }
        if (this.firstItemMaster) {
          this.firstItemMaster.destroy();
          this.firstItemMaster = null;
        }
        if (this.firstTitleSplit) {
          this.firstTitleSplit.destroy();
          this.firstTitleSplit = null;
        }
        if (this.firstImgAnim) {
          this.firstImgAnim.destroy();
          this.firstImgAnim = null;
        }
        if (this.firstSubFade) {
          this.firstSubFade.destroy();
          this.firstSubFade = null;
        }
        if (this.firstDesFade) {
          this.firstDesFade.destroy();
          this.firstDesFade = null;
        }
        if (this.firstListItemsFade) {
          this.firstListItemsFade.destroy();
          this.firstListItemsFade = null;
        }
        this.firstItemInner = null;
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
        this.originalHTMLs = [];
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

        this.splits = [];
        this.originalHTMLs = [];
        this.currentIndex = 0;
        this.isAnimating = false;

        // Query the static line elements and subtext element
        this.line1 = this.el.querySelector('.home_specialize_inner_txt:nth-child(1)');
        this.line3 = this.el.querySelector('.home_specialize_inner_txt:nth-child(3)');
        this.subtxt = this.el.querySelector('.home_specialize_subtxt_txt');

        // Store original HTML of static elements
        if (this.line1) this.originalLine1HTML = this.line1.innerHTML;
        if (this.line3) this.originalLine3HTML = this.line3.innerHTML;
        if (this.subtxt) this.originalSubtxtHTML = this.subtxt.innerHTML;

        // Create FadeSplitText for static lines
        if (this.line1) {
          this.fadeSplit1 = new FadeSplitText({ el: this.line1, splitType: 'chars' });
        }
        if (this.line3) {
          this.fadeSplit3 = new FadeSplitText({ el: this.line3, splitType: 'chars', delay: '<=0.2' });
        }
        if (this.subtxt) {
          this.fadeSplitSub = new FadeSplitText({ el: this.subtxt, splitType: 'chars', delay: '<=0.2' });
        }

        // Hide all spans initially, split their characters and align gradient backgrounds using FadeSplitText
        this.spans.forEach((span, index) => {
          this.originalHTMLs.push(span.innerHTML);
          span.style.display = 'inline-block';

          if (index === 0) {
            this.fadeSplitActive = new FadeSplitText({ el: span, splitType: 'chars', isDisableRevert: true, delay: '<=0.2' });
            this.splits.push(this.fadeSplitActive);
          } else {
            const inactiveSplit = new FadeSplitText({ el: span, splitType: 'chars', isDisableRevert: true, isDisableAnim: true });
            this.splits.push(inactiveSplit);
          }

          // Ensure the span itself is fully opaque now that GSAP handles overflow/visibility
          gsap.set(span, { opacity: 1 });
        });
      }
      animFade() {
        this.fadeTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.el,
            start: 'top top+=70%',
            once: true,
          },
          onComplete: () => {
            this.startLoop();
          }
        });

        const tweenArr = [];
        if (this.fadeSplit1) tweenArr.push(this.fadeSplit1);
        if (this.fadeSplitActive) tweenArr.push(this.fadeSplitActive);
        if (this.fadeSplit3) tweenArr.push(this.fadeSplit3);
        if (this.fadeSplitSub) tweenArr.push(this.fadeSplitSub);

        this.master = new MasterTimeline({
          timeline: this.fadeTl,
          triggerInit: this.el,
          tweenArr: tweenArr
        });
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
            end: `bottom-=${viewport.h / 2}px bottom`,
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
        if (this.timer) {
          clearInterval(this.timer);
        }
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
        gsap.set(nextSplit.textSplit.chars, { yPercent: 100 });

        const tl = gsap.timeline({
          onComplete: () => {
            this.currentIndex = nextIndex;
            this.isAnimating = false;
          }
        });

        // 1. Current active characters: animate to -100% (exit)
        tl.to(currentSplit.textSplit.chars, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power2.inOut',
          stagger: 0.02
        }, 0);

        // 2. Next active characters: animate to 0% (entrance)
        tl.to(nextSplit.textSplit.chars, {
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
        if (this.master) {
          this.master.destroy();
          this.master = null;
        }
        if (this.fadeSplit1) {
          this.fadeSplit1.destroy();
          this.fadeSplit1 = null;
        }
        if (this.fadeSplit3) {
          this.fadeSplit3.destroy();
          this.fadeSplit3 = null;
        }
        if (this.fadeSplitSub) {
          this.fadeSplitSub.destroy();
          this.fadeSplitSub = null;
        }
        if (this.scrubTl) {
          this.scrubTl.kill();
          this.scrubTl = null;
        }
        if (this.line1 && this.originalLine1HTML !== undefined) {
          this.line1.innerHTML = this.originalLine1HTML;
        }
        if (this.line3 && this.originalLine3HTML !== undefined) {
          this.line3.innerHTML = this.originalLine3HTML;
        }
        if (this.subtxt && this.originalSubtxtHTML !== undefined) {
          this.subtxt.innerHTML = this.originalSubtxtHTML;
        }
        if (this.splits) {
          this.splits.forEach(split => {
            if (split) split.destroy();
          });
          this.splits = [];
        }
        if (this.spans && this.originalHTMLs) {
          this.spans.forEach((span, index) => {
            if (this.originalHTMLs[index] !== undefined) {
              span.innerHTML = this.originalHTMLs[index];
            }
          });
          this.originalHTMLs = [];
        }
      }
    },
    Case: class extends TriggerSetup {
      constructor() {
        super();
        this.el = null;
        this.fadeTl = null;
        this.master = null;
        this.listTl = null;
        this.listMaster = null;
        this.subFade = null;
        this.titleSplit = null;
        this.itemsFade = null;
        this.seeviewFade = null;
      }
      trigger(data) {
        this.el = document.querySelector('.home_case');
        if (!this.el) return;
        super.setTrigger(this.el, this.onTrigger.bind(this));
      }
      onTrigger() {
        this.setup();
        this.animFade();
      }
      setup() {
        this.subtitle = this.el.querySelector('.home_case_subtitle');
        this.title = this.el.querySelector('.home_case_title');
        this.items = this.el.querySelectorAll('.home_case_content_item');
        this.seeview = this.el.querySelector('.home_case_seeview');

        if (this.subtitle) {
          this.subFade = new FadeIn({ el: this.subtitle, type: 'bottom', isDisableRevert: true });
        }
        if (this.title) {
          this.titleSplit = new FadeSplitText({ el: this.title, splitType: 'chars' });
        }
        if (this.items.length > 0) {
          this.itemsFade = new FadeIn({
            el: this.items,
            type: 'bottom',
            isDisableRevert: true,
            stagger: 0.1
          });
        }
        if (this.seeview) {
          this.seeviewFade = new FadeIn({
            el: this.seeview,
            type: 'bottom',
            isDisableRevert: true,
            delay: 1,
          });
        }
      }
      animFade() {
        // 1. Trigger timeline for subtitle & title
        this.fadeTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.subtitle || this.el,
            start: 'top top+=75%',
            once: true
          }
        });

        const tweenArr = [];
        if (this.subFade) tweenArr.push(this.subFade);
        if (this.titleSplit) tweenArr.push(this.titleSplit);

        this.master = new MasterTimeline({
          timeline: this.fadeTl,
          triggerInit: this.subtitle || this.el,
          tweenArr: tweenArr
        });

        // 2. Trigger timeline for content list
        const contentList = this.el.querySelector('.home_case_content_list');
        if (contentList && this.itemsFade) {
          this.listTl = gsap.timeline({
            scrollTrigger: {
              trigger: contentList,
              start: 'top top+=75%',
              once: true
            }
          });

          const listTweenArr = [this.itemsFade];
          if (this.seeviewFade) listTweenArr.push(this.seeviewFade);

          this.listMaster = new MasterTimeline({
            timeline: this.listTl,
            triggerInit: contentList,
            tweenArr: listTweenArr
          });
        }
      }
      destroy() {
        super.cleanTrigger();
        if (this.fadeTl) {
          this.fadeTl.kill();
          this.fadeTl = null;
        }
        if (this.master) {
          this.master.destroy();
          this.master = null;
        }
        if (this.listTl) {
          this.listTl.kill();
          this.listTl = null;
        }
        if (this.listMaster) {
          this.listMaster.destroy();
          this.listMaster = null;
        }
        if (this.subFade) {
          this.subFade.destroy();
          this.subFade = null;
        }
        if (this.titleSplit) {
          this.titleSplit.destroy();
          this.titleSplit = null;
        }
        if (this.itemsFade) {
          this.itemsFade.destroy();
          this.itemsFade = null;
        }
        if (this.seeviewFade) {
          this.seeviewFade.destroy();
          this.seeviewFade = null;
        }
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
        this.setup();
        this.animFade();
        this.animScrub();
        this.interact();
      }
      setup() {
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
      interact() {
        this.tabClickHandler = function () {
          if ($(this).hasClass('active')) return;

          $('.home_clients_tab_item').removeClass('active');

          let tabId = $(this).attr('data-tabs');
          $('.home_clients_tab_item[data-tabs="' + tabId + '"]').addClass('active');

          $('.home_clients_content_item').hide();
          $('.home_clients_content_item[data-tabs="' + tabId + '"]').css('display', 'flex').hide().fadeIn(300);
        };

        $('.home_clients_tab_item').on('click', this.tabClickHandler);
      }
      animFade() { }
      animScrub() { }
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
      $('[data-init]').removeAttr('data-init');
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
    footer.init(data);
    buttonTop.init();
  });
};
window.onload = mainScript;
