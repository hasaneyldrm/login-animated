(() => {
  // Element refs
  const charPurple = document.getElementById('charPurple');
  const charBlack = document.getElementById('charBlack');
  const charOrange = document.getElementById('charOrange');
  const charYellow = document.getElementById('charYellow');

  const eyesPurple = document.getElementById('eyesPurple');
  const eyesBlack = document.getElementById('eyesBlack');
  const dotsOrange = document.getElementById('dotsOrange');
  const dotsYellow = document.getElementById('dotsYellow');
  const yellowMouth = document.getElementById('yellowMouth');

  const purpleEye1 = document.getElementById('purpleEye1');
  const purpleEye2 = document.getElementById('purpleEye2');
  const blackEye1 = document.getElementById('blackEye1');
  const blackEye2 = document.getElementById('blackEye2');
  const orangeDot1 = document.getElementById('orangeDot1');
  const orangeDot2 = document.getElementById('orangeDot2');
  const yellowDot1 = document.getElementById('yellowDot1');
  const yellowDot2 = document.getElementById('yellowDot2');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePass = document.getElementById('togglePass');
  const iconEye = document.getElementById('iconEye');
  const iconEyeOff = document.getElementById('iconEyeOff');
  const form = document.getElementById('loginForm');
  const errorBox = document.getElementById('errorBox');
  const submitBtn = document.getElementById('submitBtn');
  const forgotPass = document.getElementById('forgotPass');
  const themeToggle = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');
  const charactersEl = document.getElementById('characters');
  const yellowMouthEl = yellowMouth;

  // ----- state -----
  const state = {
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    isTyping: false,
    showPassword: false,
    passwordLen: 0,
    isLookingAtEachOther: false,
    isPurplePeeking: false,
    isErroring: false,
  };

  // ----- helpers -----
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const calculateBodyPosition = (charEl) => {
    const rect = charEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    const dx = state.mouseX - cx;
    const dy = state.mouseY - cy;
    return {
      faceX: clamp(dx / 20, -15, 15),
      faceY: clamp(dy / 30, -10, 10),
      bodySkew: clamp(-dx / 120, -6, 6),
    };
  };

  const setPupilTransform = (pupilEl, force, maxDist) => {
    if (force) {
      pupilEl.style.transform = `translate(${force.x}px, ${force.y}px)`;
      return;
    }
    const r = pupilEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = state.mouseX - cx;
    const dy = state.mouseY - cy;
    const dist = Math.min(Math.hypot(dx, dy), maxDist);
    const angle = Math.atan2(dy, dx);
    pupilEl.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
  };

  // ----- render -----
  let pendingFrame = false;
  const render = () => {
    pendingFrame = false;

    // While the error animation is playing, CSS owns the char transforms.
    // Skip body writes so we don't stomp on the keyframes.
    if (state.isErroring) return;

    const { isTyping, showPassword, passwordLen, isLookingAtEachOther, isPurplePeeking } = state;
    const pwHidden = passwordLen > 0 && !showPassword;
    const pwShown = passwordLen > 0 && showPassword;

    const purplePos = calculateBodyPosition(charPurple);
    const blackPos = calculateBodyPosition(charBlack);
    const orangePos = calculateBodyPosition(charOrange);
    const yellowPos = calculateBodyPosition(charYellow);

    // ----- Purple body -----
    charPurple.style.height = (isTyping || pwHidden) ? '440px' : '400px';
    if (pwShown) {
      charPurple.style.transform = 'skewX(0deg)';
    } else if (isTyping || pwHidden) {
      charPurple.style.transform = `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`;
    } else {
      charPurple.style.transform = `skewX(${purplePos.bodySkew}deg)`;
    }

    // Purple eyes group
    let purpleEyesLeft, purpleEyesTop;
    if (pwShown) { purpleEyesLeft = 20; purpleEyesTop = 35; }
    else if (isLookingAtEachOther) { purpleEyesLeft = 55; purpleEyesTop = 65; }
    else { purpleEyesLeft = 45 + purplePos.faceX; purpleEyesTop = 40 + purplePos.faceY; }
    eyesPurple.style.left = purpleEyesLeft + 'px';
    eyesPurple.style.top = purpleEyesTop + 'px';

    // Purple pupils
    const purpleForce = pwShown
      ? { x: isPurplePeeking ? 4 : -4, y: isPurplePeeking ? 5 : -4 }
      : (isLookingAtEachOther ? { x: 3, y: 4 } : null);
    setPupilTransform(purpleEye1.firstElementChild, purpleForce, 5);
    setPupilTransform(purpleEye2.firstElementChild, purpleForce, 5);

    // ----- Black body -----
    if (pwShown) {
      charBlack.style.transform = 'skewX(0deg)';
    } else if (isLookingAtEachOther) {
      charBlack.style.transform = `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`;
    } else if (isTyping || pwHidden) {
      charBlack.style.transform = `skewX(${blackPos.bodySkew * 1.5}deg)`;
    } else {
      charBlack.style.transform = `skewX(${blackPos.bodySkew}deg)`;
    }

    // Black eyes group
    let blackEyesLeft, blackEyesTop;
    if (pwShown) { blackEyesLeft = 10; blackEyesTop = 28; }
    else if (isLookingAtEachOther) { blackEyesLeft = 32; blackEyesTop = 12; }
    else { blackEyesLeft = 26 + blackPos.faceX; blackEyesTop = 32 + blackPos.faceY; }
    eyesBlack.style.left = blackEyesLeft + 'px';
    eyesBlack.style.top = blackEyesTop + 'px';

    // Black pupils
    const blackForce = pwShown
      ? { x: -4, y: -4 }
      : (isLookingAtEachOther ? { x: 0, y: -4 } : null);
    setPupilTransform(blackEye1.firstElementChild, blackForce, 4);
    setPupilTransform(blackEye2.firstElementChild, blackForce, 4);

    // ----- Orange body -----
    charOrange.style.transform = pwShown
      ? 'skewX(0deg)'
      : `skewX(${orangePos.bodySkew}deg)`;

    // Orange dots group
    let orangeDotsLeft, orangeDotsTop;
    if (pwShown) { orangeDotsLeft = 50; orangeDotsTop = 85; }
    else { orangeDotsLeft = 82 + orangePos.faceX; orangeDotsTop = 90 + orangePos.faceY; }
    dotsOrange.style.left = orangeDotsLeft + 'px';
    dotsOrange.style.top = orangeDotsTop + 'px';

    // Orange dots (these track mouse internally — no eye whites)
    const orangeForce = pwShown ? { x: -5, y: -4 } : null;
    setPupilTransform(orangeDot1, orangeForce, 5);
    setPupilTransform(orangeDot2, orangeForce, 5);

    // ----- Yellow body -----
    charYellow.style.transform = pwShown
      ? 'skewX(0deg)'
      : `skewX(${yellowPos.bodySkew}deg)`;

    // Yellow dots + mouth
    let yellowDotsLeft, yellowDotsTop, yellowMouthLeft, yellowMouthTop;
    if (pwShown) {
      yellowDotsLeft = 20; yellowDotsTop = 35;
      yellowMouthLeft = 10; yellowMouthTop = 88;
    } else {
      yellowDotsLeft = 52 + yellowPos.faceX; yellowDotsTop = 40 + yellowPos.faceY;
      yellowMouthLeft = 40 + yellowPos.faceX; yellowMouthTop = 88 + yellowPos.faceY;
    }
    dotsYellow.style.left = yellowDotsLeft + 'px';
    dotsYellow.style.top = yellowDotsTop + 'px';
    yellowMouth.style.left = yellowMouthLeft + 'px';
    yellowMouth.style.top = yellowMouthTop + 'px';

    const yellowForce = pwShown ? { x: -5, y: -4 } : null;
    setPupilTransform(yellowDot1, yellowForce, 5);
    setPupilTransform(yellowDot2, yellowForce, 5);
  };

  const requestRender = () => {
    if (pendingFrame) return;
    pendingFrame = true;
    requestAnimationFrame(render);
  };

  // ----- mouse -----
  window.addEventListener('mousemove', (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    requestRender();
  }, { passive: true });

  window.addEventListener('resize', requestRender);

  // ----- typing detection (only email triggers isTyping, matching source) -----
  let lookTimer = null;
  emailInput.addEventListener('focus', () => {
    state.isTyping = true;
    state.isLookingAtEachOther = true;
    if (lookTimer) clearTimeout(lookTimer);
    lookTimer = setTimeout(() => {
      state.isLookingAtEachOther = false;
      lookTimer = null;
      requestRender();
    }, 800);
    requestRender();
  });
  emailInput.addEventListener('blur', () => {
    state.isTyping = false;
    state.isLookingAtEachOther = false;
    if (lookTimer) { clearTimeout(lookTimer); lookTimer = null; }
    requestRender();
  });

  passwordInput.addEventListener('input', () => {
    const wasZero = state.passwordLen === 0;
    state.passwordLen = passwordInput.value.length;
    if (wasZero && state.passwordLen > 0 && state.showPassword) startPeekChain();
    requestRender();
  });

  // ----- show/hide password -----
  togglePass.addEventListener('click', () => {
    state.showPassword = !state.showPassword;
    passwordInput.type = state.showPassword ? 'text' : 'password';
    iconEye.style.display = state.showPassword ? 'none' : '';
    iconEyeOff.style.display = state.showPassword ? '' : 'none';
    togglePass.setAttribute('aria-label', state.showPassword ? 'Şifreyi gizle' : 'Şifreyi göster');
    if (state.passwordLen > 0 && state.showPassword) startPeekChain();
    requestRender();
  });

  // ----- random blink (purple, black) -----
  const scheduleBlink = (charEl) => {
    const next = () => {
      const delay = 3000 + Math.random() * 4000;
      setTimeout(() => {
        charEl.classList.add('blink');
        setTimeout(() => {
          charEl.classList.remove('blink');
          next();
        }, 150);
      }, delay);
    };
    next();
  };
  scheduleBlink(charPurple);
  scheduleBlink(charBlack);

  // ----- purple peeking when password is shown -----
  let peekChainRunning = false;
  function startPeekChain() {
    if (peekChainRunning) return;
    peekChainRunning = true;
    const tick = () => {
      if (!(state.passwordLen > 0 && state.showPassword)) {
        peekChainRunning = false;
        state.isPurplePeeking = false;
        requestRender();
        return;
      }
      setTimeout(() => {
        if (!(state.passwordLen > 0 && state.showPassword)) {
          peekChainRunning = false;
          state.isPurplePeeking = false;
          requestRender();
          return;
        }
        state.isPurplePeeking = true;
        requestRender();
        setTimeout(() => {
          state.isPurplePeeking = false;
          requestRender();
          tick();
        }, 800);
      }, 2000 + Math.random() * 3000);
    };
    tick();
  }

  // ----- error animation (per-character, subtle) -----
  let errorBodyTimer = null;
  let errorMoodTimer = null;
  const clearErrorClasses = () => {
    charPurple.classList.remove('error-anim');
    charOrange.classList.remove('crying');
    charYellow.classList.remove('crying');
    yellowMouthEl.classList.remove('sad');
    purpleEye1.classList.remove('sad-eye');
    purpleEye2.classList.remove('sad-eye');
    blackEye1.classList.remove('sad-eye');
    blackEye2.classList.remove('sad-eye');
  };

  const triggerErrorAnimation = () => {
    if (errorBodyTimer) { clearTimeout(errorBodyTimer); errorBodyTimer = null; }
    if (errorMoodTimer) { clearTimeout(errorMoodTimer); errorMoodTimer = null; }
    clearErrorClasses();

    // hand off purple's transform to CSS animation
    state.isErroring = true;
    charPurple.style.transform = '';

    // force reflow so the animation can restart cleanly on rapid retries
    void charPurple.offsetWidth;

    charPurple.classList.add('error-anim');

    // emotional reactions (no body shake on others)
    yellowMouthEl.classList.add('sad');
    purpleEye1.classList.add('sad-eye');
    purpleEye2.classList.add('sad-eye');
    blackEye1.classList.add('sad-eye');
    blackEye2.classList.add('sad-eye');
    charOrange.classList.add('crying');
    charYellow.classList.add('crying');

    errorBox.classList.remove('shake');
    void errorBox.offsetWidth;
    errorBox.classList.add('shake');

    // end body animation, return control to render()
    errorBodyTimer = setTimeout(() => {
      charPurple.classList.remove('error-anim');
      charOrange.classList.remove('crying');
      charYellow.classList.remove('crying');
      state.isErroring = false;
      requestRender();
      errorBodyTimer = null;
    }, 1300);

    // sad mood lingers a bit longer
    errorMoodTimer = setTimeout(() => {
      yellowMouthEl.classList.remove('sad');
      purpleEye1.classList.remove('sad-eye');
      purpleEye2.classList.remove('sad-eye');
      blackEye1.classList.remove('sad-eye');
      blackEye2.classList.remove('sad-eye');
      errorMoodTimer = null;
    }, 2200);
  };

  // ----- form submit -----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    errorBox.classList.remove('info');
    errorBox.classList.remove('shake');
    errorBox.textContent = 'Invalid email or password. Please try again.';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    await new Promise((r) => setTimeout(r, 300));
    if (emailInput.value === 'erik@gmail.com' && passwordInput.value === '1234') {
      alert('Login successful!');
    } else {
      errorBox.hidden = false;
      triggerErrorAnimation();
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log in';
  });

  // ----- forgot password -----
  let infoTimer = null;
  const showInfo = (msg) => {
    if (infoTimer) clearTimeout(infoTimer);
    errorBox.textContent = msg;
    errorBox.classList.add('info');
    errorBox.hidden = false;
    infoTimer = setTimeout(() => {
      errorBox.hidden = true;
      errorBox.classList.remove('info');
      errorBox.textContent = 'Invalid email or password. Please try again.';
      infoTimer = null;
    }, 3500);
  };

  forgotPass.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      emailInput.focus();
      showInfo('Please enter your email first.');
      return;
    }
    showInfo(`Password reset link sent to ${email}.`);
  });

  // ----- theme (dark mode) -----
  const THEME_KEY = 'login-animated.theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    iconSun.style.display = isDark ? 'none' : '';
    iconMoon.style.display = isDark ? '' : 'none';
    themeToggle.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
  };

  const getInitialTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return prefersDark.matches ? 'dark' : 'light';
  };

  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
  });

  prefersDark.addEventListener('change', (e) => {
    if (localStorage.getItem(THEME_KEY)) return; // user override wins
    currentTheme = e.matches ? 'dark' : 'light';
    applyTheme(currentTheme);
  });

  // initial paint
  render();
})();
