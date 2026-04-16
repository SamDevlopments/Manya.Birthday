
// ===== Quiz Data =====
const quizQuestions = [
  { id: 1, q: "Valorant pe kab aoogi?", placeholder: "btao btao..." },
  { id: 2, q: "What do u think about me?", placeholder: "kuch to hoga..." },
  { id: 3, q: "Favorite food kya hai?", placeholder: "mere dimag ke ilava..." },
  { id: 4, q: "What things u hate the most?", placeholder: "be honest..." }
];

let quizAnswers = new Array(quizQuestions.length).fill('');
let currentQuestionIndex = 0;
let gameStarted = false;

// ===== Confetti Function =====
function fireConfetti(options = {}) {
  const defaults = {
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#3b82f6', '#60a5fa', '#ffffff'],
    gravity: 0.8,
    shapes: ['circle', 'square']
  };
  
  const config = { ...defaults, ...options };
  
  // Create canvas if doesn't exist
  let canvas = document.getElementById('confettiCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    canvas.className = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);
  }
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = config.particleCount;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: config.origin.x * canvas.width,
      y: config.origin.y * canvas.height,
      vx: (Math.random() - 0.5) * config.spread,
      vy: (Math.random() - 1) * config.spread,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: Math.random() * 8 + 4,
      gravity: config.gravity,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }
  
  let animationId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      
      if (p.y > canvas.height) {
        particles.splice(i, 1);
      }
    });
    
    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
    }
  }
  
  animate();
  
  // Auto-remove canvas after animation
  setTimeout(() => {
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }, 3000);
}

// ===== Opening Screen =====
document.addEventListener('DOMContentLoaded', () => {
  const candles = document.querySelectorAll('.candle-wrapper');
  const candleText = document.getElementById('candleText');
  const startBtn = document.getElementById('startBtn');
  const openingScreen = document.getElementById('openingScreen');
  const mainApp = document.getElementById('mainApp');
  
  let blownCount = 0;
  const candleStates = [true, true, true];
  
  candles.forEach((candle, index) => {
    candle.addEventListener('click', () => {
      if (!candleStates[index]) return;
      
      candleStates[index] = false;
      blownCount++;
      
      // Hide flame
      const flame = candle.querySelector('.flame-container');
      if (flame) {
        flame.classList.remove('active');
        flame.style.display = 'none';
      }
      
      // Mini confetti
      fireConfetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.7, x: 0.35 + (index * 0.15) },
        colors: ['#2563eb', '#ffffff']
      });
      
      // Check if all blown
      if (blownCount === 3) {
        candleText.classList.add('hidden');
        startBtn.classList.remove('hidden');
        
        // Big confetti
        setTimeout(() => {
          fireConfetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#3b82f6', '#ffffff']
          });
        }, 500);
      }
    });
  });
  
  // Start button
  startBtn.addEventListener('click', () => {
    openingScreen.classList.add('exiting');
    
    setTimeout(() => {
      openingScreen.style.display = 'none';
      mainApp.classList.remove('hidden');
      hasStarted = true;
      
      // Big celebration confetti
      fireConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa']
      });
    }, 1000);
  });
  
// ===== Countdown =====
  function updateCountdown() {
    const targetDate = new Date('2026-04-26T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      document.getElementById('countdownDays').textContent = days;
      document.getElementById('countdownHours').textContent = hours;
      document.getElementById('countdownMins').textContent = minutes;
      document.getElementById('countdownSecs').textContent = seconds;
    }
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // ===== Quiz Game =====
  const startQuizBtn = document.getElementById('startQuizBtn');
  const quizStartScreen = document.getElementById('quizStartScreen');
  const quizQuestionScreen = document.getElementById('quizQuestionScreen');
  const quizResultScreen = document.getElementById('quizResultScreen');
  const quizBackBtn = document.getElementById('quizBackBtn');
  const nextQBtn = document.getElementById('nextQBtn');
  const goBackBtn = document.getElementById('goBackBtn');
  const copyAnswersBtn = document.getElementById('copyAnswersBtn');
  
  startQuizBtn.addEventListener('click', () => {
    gameStarted = true;
    currentQuestionIndex = 0;
    quizAnswers = new Array(quizQuestions.length).fill('');
    showQuestionScreen();
  });
  
  quizBackBtn.addEventListener('click', showStartScreen);
  goBackBtn.addEventListener('click', showStartScreen);
  
  function showStartScreen() {
    quizStartScreen.classList.remove('hidden');
    quizQuestionScreen.classList.add('hidden');
    quizResultScreen.classList.add('hidden');
    gameStarted = false;
  }
  
  function showQuestionScreen() {
    quizStartScreen.classList.add('hidden');
    quizQuestionScreen.classList.remove('hidden');
    quizResultScreen.classList.add('hidden');
    
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('currentQ').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQ').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('answerInput').value = quizAnswers[currentQuestionIndex];
    document.getElementById('answerInput').placeholder = q.placeholder;
  }
  
  function showResultScreen() {
    quizStartScreen.classList.add('hidden');
    quizQuestionScreen.classList.add('hidden');
    quizResultScreen.classList.remove('hidden');
  }
  
  document.getElementById('answerInput').addEventListener('input', (e) => {
    quizAnswers[currentQuestionIndex] = e.target.value;
  });
  
  nextQBtn.addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      showQuestionScreen();
    } else {
      showResultScreen();
    }
  });
  
  copyAnswersBtn.addEventListener('click', async () => {
    let content = "Manya's Birthday Game Answers:\n\n";
    quizQuestions.forEach((q, index) => {
      content += `Question ${index + 1}: ${q.q}\n`;
      content += `Your Answer: ${quizAnswers[index] || '[No Answer Provided]'}\n\n`;
    });
    
    try {
      await navigator.clipboard.writeText(content);
      alert("Answers copied to clipboard! Don't forget to send them to Tutan. 😉");
    } catch (err) {
      console.error('Failed to copy:', err);
      alert("Failed to copy answers. Please try again or copy manually.");
    }
  });

  const sendToTutanBtn = document.getElementById('sendToTutanBtn');
  sendToTutanBtn.addEventListener('click', () => {
    window.open('https://www.instagram.com/tutangamingxd/', '_blank');
  });

  // ===== iOS-style Notifications for NEET Preparation =====
  const neetBlessings = [
    "May your NEET preparation be blessed with divine wisdom! 📚✨",
    "Success in your medical journey awaits - keep studying hard! 🏥💪",
    "Every concept you master brings you closer to your dream! 🎯🌟",
    "Your dedication to NEET will surely pay off! 📖🙏",
    "Blessings for clarity and focus in your studies! 🧠💎",
    "May you crack NEET with flying colors! 🎓🏆",
    "Your hard work + God's grace = NEET success! 📝✅",
    "Stay strong, stay focused - medical seat is yours! 🏥💊",
    "Each study session takes you closer to your goal! 📈🔥"
  ];

  function showNEETNotification() {
    const container = document.getElementById('notificationContainer');
    
    // Clear any existing notification before showing new one
    container.innerHTML = '';
    
    const randomBlessing = neetBlessings[Math.floor(Math.random() * neetBlessings.length)];
    
    const notification = document.createElement('div');
    notification.className = 'ios-notification';
    notification.innerHTML = `
      <div class="app-icon">
        <img src="https://i.ibb.co/nFQQCV5/tutangamingxd-avatar-SHORTCODE-20260410-151328-624715264.jpg" alt="Tutan">
      </div>
      
      <div class="notification-body">
        <div class="notification-header">
          <span class="app-name">Tutan</span>
          <span class="time">now</span>
        </div>
        
        <div class="notification-content">
          <p class="message">${randomBlessing}</p>
        </div>
      </div>
    `;
    
    container.appendChild(notification);
    
    // Add click functionality to slide up fast
    notification.addEventListener('click', () => {
      notification.classList.add('shatter-fast');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 200);
    });
    
    // Trigger slide-in animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('shatter');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 600);
    }, 3000);
  }

  // Show notifications at 8-second intervals
  setInterval(showNEETNotification, 8000); // Show every 8 seconds
  
  // Show first notification after 10 seconds
  setTimeout(showNEETNotification, 10000);
  
  // ===== Ripple Effect =====
  document.body.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const size = 50;
    ripple.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.3);
      left: ${e.clientX - size/2}px;
      top: ${e.clientY - size/2}px;
      pointer-events: none;
      animation: rippleEffect 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
  
  // ===== Double Tap Confetti (Easter Egg) =====
  let lastTap = 0;
  document.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      fireConfetti({
        particleCount: 40,
        spread: 80,
        origin: { 
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight 
        },
        colors: ['#22d3ee', '#67e8f9'],
        shapes: ['circle'],
        gravity: 0.4
      });
    }
    lastTap = now;
  });
  
  // ===== Keyboard Navigation =====
  document.addEventListener('keydown', (e) => {
    if (musicModal.classList.contains('hidden')) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.code === 'ArrowLeft') {
      playPrevious();
    } else if (e.code === 'ArrowRight') {
      playNext();
    } else if (e.code === 'Escape') {
      musicModal.classList.add('hidden');
    }
  });
  
  // ===== Scroll Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all scroll-animate elements
  document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(el => {
    observer.observe(el);
  });
  
  // ===== Mini Chat Functionality =====
  const chatBtn = document.getElementById('chatBtn');
  const miniChat = document.getElementById('miniChat');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatMessages = document.getElementById('chatMessages');
  
  // Toggle chat visibility
  chatBtn.addEventListener('click', () => {
    miniChat.classList.toggle('hidden');
  });
  
  // Close chat
  closeChatBtn.addEventListener('click', () => {
    miniChat.classList.add('hidden');
  });
  
  // Groq API configuration
  const GROQ_API_KEY = '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';
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  // Conversation history for context
  let conversationHistory = [
    {
      role: 'system',
      content: 'You are a friendly, conversational AI assistant. Keep responses brief, natural, and engaging. Use emojis occasionally to make the conversation more lively. You are talking to Manya on her birthday.'
    }
  ];

  // Function to call Groq API
  async function getGroqResponse(userMessage) {
    try {
      console.log('Calling Groq API...');
      console.log('API Key present:', GROQ_API_KEY ? 'Yes' : 'No');
      console.log('API URL:', GROQ_API_URL);
      
      // Add user message to conversation history
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const requestBody = {
        model: 'llama3-70b-8192',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      const aiResponse = data.choices[0].message.content;
      console.log('AI Response:', aiResponse);

      // Add AI response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Keep conversation history manageable (last 10 messages)
      if (conversationHistory.length > 11) {
        conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-10)];
      }

      return aiResponse;
    } catch (error) {
      console.error('Groq API error:', error);
      console.error('Error details:', error.message);
      return "Sorry, I'm having trouble connecting right now. Please try again! 😊";
    }
  }

  // Send message
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Handle editing existing message
      if (editingMessage) {
        const messageContentText = editingMessage.querySelector('.message-content-text');
        if (messageContentText) {
          messageContentText.textContent = message;
        }
        
        // Add edited indicator if not already present (in metadata container)
        const messageWrapper = editingMessage.closest('.message-wrapper');
        if (messageWrapper && !messageWrapper.querySelector('.edited-indicator')) {
          const metadataDiv = document.createElement('div');
          metadataDiv.className = 'message-metadata';
          const editedSpan = document.createElement('span');
          editedSpan.className = 'edited-indicator';
          editedSpan.textContent = 'edited';
          metadataDiv.appendChild(editedSpan);
          messageWrapper.insertBefore(metadataDiv, messageWrapper.firstChild);
        }
        
        // Update reply preview if editing the message being replied to
        if (replyingToMessageElement && editingMessage === replyingToMessageElement) {
          replyingTo = message;
          const replyText = replyPreview.querySelector('.reply-text');
          if (replyText) {
            replyText.textContent = message;
          }
        }
        
        // Clear editing state
        editingMessage = null;
        editPreview.classList.add('hidden');
        chatInput.value = '';
        return;
      }
      
      if (replyingTo) {
        // Add reply indicator with Instagram-style
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper sent reply';
        const replySender = isReplyingToSelf ? 'You' : 'Tutan';
        messageWrapper.innerHTML = `
          <div class="message-content-row">
            <div class="message sent">
              <div class="reply-indicator">
                <div class="reply-indicator-bar">
                  <span class="reply-indicator-sender">${replySender}</span>
                  <span class="reply-indicator-text">${replyingTo}</span>
                </div>
              </div>
              <span class="message-content-text">${message}</span>
              <div class="quick-reactions hidden">
                <span class="reaction-emoji">🤍</span>
                <span class="reaction-emoji">🦢</span>
                <span class="reaction-emoji">☁️</span>
                <span class="reaction-emoji">🕊️</span>
                <span class="reaction-emoji">👀</span>
                <button class="add-reaction-btn">+</button>
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn reaction-btn" title="React">☺︎</button>
              <button class="action-btn reply-btn" title="Reply">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
              </button>
              <button class="action-btn more-btn" title="More">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="swipe-reply-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </div>
        `;
        chatMessages.appendChild(messageWrapper);
        
        // Clear reply
        replyingTo = null;
        replyingToMessageElement = null;
        isReplyingToSelf = false;
        replyPreview.classList.add('hidden');
      } else {
        // Regular message
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper sent';
        messageWrapper.innerHTML = `
          <div class="message-content-row">
            <div class="message sent">
              <span class="message-content-text">${message}</span>
              <div class="quick-reactions hidden">
                <span class="reaction-emoji">🤍</span>
                <span class="reaction-emoji">🦢</span>
                <span class="reaction-emoji">☁️</span>
                <span class="reaction-emoji">🕊️</span>
                <span class="reaction-emoji">👀</span>
                <button class="add-reaction-btn">+</button>
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn reaction-btn" title="React">☺︎</button>
              <button class="action-btn reply-btn" title="Reply">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
              </button>
              <button class="action-btn more-btn" title="More">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="swipe-reply-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </div>
        `;
        chatMessages.appendChild(messageWrapper);
      }
      
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Get AI response from Groq
      getGroqResponse(message).then(aiResponse => {
        const receivedMessageWrapper = document.createElement('div');
        receivedMessageWrapper.className = 'message-wrapper received';
        receivedMessageWrapper.innerHTML = `
          <div class="message-content-row">
            <div class="message received">
              <span class="message-content-text">${aiResponse}</span>
              <div class="quick-reactions hidden">
                <span class="reaction-emoji">🤍</span>
                <span class="reaction-emoji">🦢</span>
                <span class="reaction-emoji">☁️</span>
                <span class="reaction-emoji">🕊️</span>
                <span class="reaction-emoji">👀</span>
                <button class="add-reaction-btn">+</button>
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn reaction-btn" title="React">☺︎</button>
              <button class="action-btn reply-btn" title="Reply">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
              </button>
              <button class="action-btn more-btn" title="More">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="swipe-reply-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </div>
        `;
        chatMessages.appendChild(receivedMessageWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  }
  
  sendChatBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Handle message click to show action buttons
  chatMessages.addEventListener('click', (e) => {
    const messageWrapper = e.target.closest('.message-wrapper');
    
    // Remove active class from all message wrappers
    document.querySelectorAll('.message-wrapper.active').forEach(wrapper => {
      wrapper.classList.remove('active');
    });
    
    // Add active class to clicked message wrapper
    if (messageWrapper) {
      messageWrapper.classList.add('active');
    }
  });
  
  // Remove active class when clicking outside messages
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.message-wrapper') && !e.target.closest('.message-actions') && !e.target.closest('.quick-reactions') && !e.target.closest('.more-menu')) {
      document.querySelectorAll('.message-wrapper.active').forEach(wrapper => {
        wrapper.classList.remove('active');
      });
    }
  });
  
  // ===== Message Actions =====
  let activeMessage = null;
  let activeMessageWrapper = null;
  let replyingTo = null;
  let replyingToMessageElement = null;
  let isReplyingToSelf = false;
  let editingMessage = null;
  const moreMenuReceived = document.getElementById('moreMenuReceived');
  const moreMenuSent = document.getElementById('moreMenuSent');
  const replyPreview = document.getElementById('replyPreview');
  const cancelReplyBtn = document.getElementById('cancelReplyBtn');
  const editPreview = document.getElementById('editPreview');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  
  // Close more menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!moreMenuReceived.contains(e.target) && !e.target.closest('.more-btn')) {
      moreMenuReceived.classList.add('hidden');
    }
    if (!moreMenuSent.contains(e.target) && !e.target.closest('.more-btn')) {
      moreMenuSent.classList.add('hidden');
    }
    
    // Close quick reactions when clicking outside
    document.querySelectorAll('.quick-reactions').forEach(reactions => {
      if (!reactions.contains(e.target) && !e.target.closest('.reaction-btn')) {
        reactions.classList.add('hidden');
      }
    });
  });
  
  // Handle reaction button click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.reaction-btn')) {
      const reactionBtn = e.target.closest('.reaction-btn');
      const messageContentRow = reactionBtn.closest('.message-content-row');
      const reactionsEl = messageContentRow.querySelector('.quick-reactions');
      
      console.log('Menu opened', reactionsEl);
      
      // Close other reaction bars
      document.querySelectorAll('.quick-reactions').forEach(r => {
        if (r !== reactionsEl) r.classList.add('hidden');
      });
      
      reactionsEl.classList.toggle('hidden');
    }
  });
  
  // Handle emoji click in quick reactions
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('reaction-emoji')) {
      const messageEl = e.target.closest('.message');
      const messageWrapper = messageEl.closest('.message-wrapper');
      const emoji = e.target.textContent;
      
      // Toggle reaction pill
      const reactionPill = messageWrapper.querySelector('.reaction-pill');
      if (reactionPill) {
        reactionPill.classList.toggle('hidden');
        reactionPill.textContent = emoji;
      } else {
        // Create reaction pill if it doesn't exist
        const newPill = document.createElement('div');
        newPill.className = 'reaction-pill';
        newPill.textContent = emoji;
        messageEl.appendChild(newPill);
      }
      
      // Hide reactions bar
      messageEl.querySelector('.quick-reactions').classList.add('hidden');
    }
  });
  
  // Handle reply button click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.reply-btn')) {
      const replyBtn = e.target.closest('.reply-btn');
      const messageContentRow = replyBtn.closest('.message-content-row');
      const messageEl = messageContentRow.querySelector('.message');
      const messageText = messageEl.querySelector('span').textContent;
      const isOwnMessage = messageEl.classList.contains('sent');
      
      replyingTo = messageText;
      replyingToMessageElement = messageEl;
      isReplyingToSelf = isOwnMessage;
      replyPreview.classList.remove('hidden');
      
      // Update reply label and text based on if it's own message
      const replyLabel = replyPreview.querySelector('.reply-label');
      const replyText = replyPreview.querySelector('.reply-text');
      
      if (isOwnMessage) {
        replyLabel.textContent = 'Replying to yourself';
        replyText.textContent = messageText;
      } else {
        replyLabel.textContent = 'Replying to Tutan';
        replyText.textContent = messageText;
      }
      
      chatInput.focus();
      
      // Hide reactions bar if open
      const reactionsEl = messageEl.querySelector('.quick-reactions');
      if (reactionsEl) {
        reactionsEl.classList.add('hidden');
      }
    }
  });

  // Handle Instagram-style swipe to reply gesture
  let swipeStartX = 0;
  let swipeCurrentMessageWrapper = null;
  let swipeMessageContentRow = null;
  let swipeReplyArrow = null;
  let isSwiping = false;
  let messageDirection = null; // 'left' for received, 'right' for sent
  const SWIPE_THRESHOLD = 45;
  const MAX_SWIPE_DISTANCE = 60;

  document.addEventListener('touchstart', (e) => {
    const messageWrapper = e.target.closest('.message-wrapper');
    if (messageWrapper && !e.target.closest('.reaction-btn') && !e.target.closest('.quick-reactions') && !e.target.closest('.more-btn') && !e.target.closest('.action-btn')) {
      swipeStartX = e.touches[0].clientX;
      swipeCurrentMessageWrapper = messageWrapper;
      swipeMessageContentRow = messageWrapper.querySelector('.message-content-row');
      swipeReplyArrow = messageWrapper.querySelector('.swipe-reply-arrow');
      isSwiping = true;
      
      // Determine message direction
      const messageEl = messageWrapper.querySelector('.message');
      messageDirection = messageEl.classList.contains('sent') ? 'right' : 'left';
      
      // Remove transition for instant drag
      if (swipeMessageContentRow) {
        swipeMessageContentRow.classList.add('swiping');
      }
    }
  });

  document.addEventListener('touchmove', (e) => {
    if (!isSwiping || !swipeMessageContentRow) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - swipeStartX;
    
    // Allow swipe based on message direction
    if (messageDirection === 'left' && deltaX > 0) {
      // Received messages: swipe right
      const swipeDistance = Math.min(deltaX, MAX_SWIPE_DISTANCE);
      swipeMessageContentRow.style.transform = `translateX(${swipeDistance}px)`;
      
      // Reveal arrow
      if (swipeReplyArrow) {
        const revealProgress = Math.min(swipeDistance / 30, 1);
        swipeReplyArrow.style.opacity = revealProgress;
        swipeReplyArrow.style.transform = `translateY(-50%) scale(${0.5 + (revealProgress * 0.5)})`;
        if (revealProgress > 0) {
          swipeReplyArrow.classList.add('visible');
        } else {
          swipeReplyArrow.classList.remove('visible');
        }
      }
    } else if (messageDirection === 'right' && deltaX < 0) {
      // Sent messages: swipe left
      const swipeDistance = Math.min(Math.abs(deltaX), MAX_SWIPE_DISTANCE);
      swipeMessageContentRow.style.transform = `translateX(-${swipeDistance}px)`;
      
      // Reveal arrow (positioned on right for sent messages)
      if (swipeReplyArrow) {
        const revealProgress = Math.min(swipeDistance / 30, 1);
        swipeReplyArrow.style.opacity = revealProgress;
        swipeReplyArrow.style.transform = `translateY(-50%) scale(${0.5 + (revealProgress * 0.5)})`;
        if (revealProgress > 0) {
          swipeReplyArrow.classList.add('visible');
        } else {
          swipeReplyArrow.classList.remove('visible');
        }
      }
    }
  });

  document.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    
    const endX = e.changedTouches[0].clientX;
    const swipeDistance = Math.abs(endX - swipeStartX);
    
    // Check if swipe exceeded threshold and in correct direction
    const deltaX = endX - swipeStartX;
    const correctDirection = (messageDirection === 'left' && deltaX > 0) || (messageDirection === 'right' && deltaX < 0);
    
    if (swipeDistance >= SWIPE_THRESHOLD && correctDirection) {
      // Trigger reply mode
      const messageEl = swipeCurrentMessageWrapper.querySelector('.message');
      const messageText = messageEl.querySelector('span').textContent;
      const isSent = messageEl.classList.contains('sent');
      
      replyingTo = messageText;
      replyingToMessageElement = messageEl;
      isReplyingToSelf = isSent;
      replyPreview.classList.remove('hidden');
      
      // Update reply label and text
      const replyLabel = replyPreview.querySelector('.reply-label');
      const replyText = replyPreview.querySelector('.reply-text');
      
      if (isSent) {
        replyLabel.textContent = 'Replying to yourself';
        replyText.textContent = messageText;
      } else {
        replyLabel.textContent = 'Replying to Tutan';
        replyText.textContent = messageText;
      }
      
      chatInput.focus();
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Hide reactions bar if open
      const reactionsEl = messageEl.querySelector('.quick-reactions');
      if (reactionsEl) {
        reactionsEl.classList.add('hidden');
      }
    }
    
    // Spring back animation
    if (swipeMessageContentRow) {
      swipeMessageContentRow.classList.remove('swiping');
      swipeMessageContentRow.style.transform = 'translateX(0)';
    }
    
    // Hide arrow
    if (swipeReplyArrow) {
      swipeReplyArrow.style.opacity = '0';
      swipeReplyArrow.style.transform = 'translateY(-50%) scale(0)';
      swipeReplyArrow.classList.remove('visible');
    }
    
    // Reset variables
    isSwiping = false;
    swipeCurrentMessageWrapper = null;
    swipeMessageContentRow = null;
    swipeReplyArrow = null;
    messageDirection = null;
  });

  // Handle long press for reactions
  let longPressTimer = null;
  let longPressMessageWrapper = null;
  let longPressStartX = 0;
  let longPressStartY = 0;

  document.addEventListener('touchstart', (e) => {
    const messageWrapper = e.target.closest('.message-wrapper');
    if (messageWrapper && !e.target.closest('.reaction-btn') && !e.target.closest('.quick-reactions') && !e.target.closest('.more-btn')) {
      longPressMessageWrapper = messageWrapper;
      longPressStartX = e.touches[0].clientX;
      longPressStartY = e.touches[0].clientY;
      
      // Start long press timer (500ms)
      longPressTimer = setTimeout(() => {
        if (longPressMessageWrapper) {
          const messageEl = longPressMessageWrapper.querySelector('.message');
          const reactionsEl = messageEl.querySelector('.quick-reactions');
          
          // Close other reaction bars
          document.querySelectorAll('.quick-reactions').forEach(r => {
            if (r !== reactionsEl) r.classList.add('hidden');
          });
          
          // Show reactions for this message
          reactionsEl.classList.remove('hidden');
          
          // Add visual feedback
          longPressMessageWrapper.classList.add('active');
        }
      }, 500);
    }
  });

  document.addEventListener('touchmove', (e) => {
    if (longPressTimer) {
      const moveX = e.touches[0].clientX;
      const moveY = e.touches[0].clientY;
      const deltaX = Math.abs(moveX - longPressStartX);
      const deltaY = Math.abs(moveY - longPressStartY);
      
      // Cancel long press if moved too much (more than 10px)
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }
  });

  document.addEventListener('touchend', () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    longPressMessageWrapper = null;
  });

  // Also handle mouse events for desktop long press
  let mousePressTimer = null;
  let mousePressMessageWrapper = null;

  document.addEventListener('mousedown', (e) => {
    const messageWrapper = e.target.closest('.message-wrapper');
    if (messageWrapper && !e.target.closest('.reaction-btn') && !e.target.closest('.quick-reactions') && !e.target.closest('.more-btn')) {
      mousePressMessageWrapper = messageWrapper;
      
      // Start long press timer (500ms)
      mousePressTimer = setTimeout(() => {
        if (mousePressMessageWrapper) {
          const messageEl = mousePressMessageWrapper.querySelector('.message');
          const reactionsEl = messageEl.querySelector('.quick-reactions');
          
          // Close other reaction bars
          document.querySelectorAll('.quick-reactions').forEach(r => {
            if (r !== reactionsEl) r.classList.add('hidden');
          });
          
          // Show reactions for this message
          reactionsEl.classList.remove('hidden');
          
          // Add visual feedback
          mousePressMessageWrapper.classList.add('active');
        }
      }, 500);
    }
  });

  document.addEventListener('mouseup', () => {
    if (mousePressTimer) {
      clearTimeout(mousePressTimer);
      mousePressTimer = null;
    }
    mousePressMessageWrapper = null;
  });

  document.addEventListener('mousemove', (e) => {
    if (mousePressTimer) {
      // Cancel long press on mouse move
      clearTimeout(mousePressTimer);
      mousePressTimer = null;
    }
  });
  
  // Handle more button click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.more-btn')) {
      const moreBtn = e.target.closest('.more-btn');
      const messageWrapper = moreBtn.closest('.message-wrapper');
      const messageEl = messageWrapper.querySelector('.message');
      const rect = moreBtn.getBoundingClientRect();
      
      // Determine message type and show appropriate menu
      if (messageEl.classList.contains('received')) {
        moreMenuReceived.style.top = `${rect.bottom + 8}px`;
        moreMenuReceived.style.left = `${rect.right - 160}px`;
        moreMenuReceived.classList.remove('hidden');
        moreMenuSent.classList.add('hidden');
      } else {
        moreMenuSent.style.top = `${rect.bottom + 8}px`;
        moreMenuSent.style.left = `${rect.right - 160}px`;
        moreMenuSent.classList.remove('hidden');
        moreMenuReceived.classList.add('hidden');
      }
      
      activeMessage = messageEl;
      activeMessageWrapper = messageWrapper;
      
      // Hide reactions bar if open
      messageEl.querySelector('.quick-reactions')?.classList.add('hidden');
    }
  });
  
  // Handle more menu - reply button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.more-reply-btn')) {
      const messageText = activeMessage.querySelector('span').textContent;
      
      replyingTo = messageText;
      replyPreview.classList.remove('hidden');
      replyPreview.querySelector('.reply-text').textContent = messageText;
      chatInput.focus();
      
      moreMenuReceived.classList.add('hidden');
      moreMenuSent.classList.add('hidden');
    }
  });
  
  // Handle more menu - copy button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.more-copy-btn')) {
      const messageText = activeMessage.querySelector('span').textContent;
      
      navigator.clipboard.writeText(messageText).then(() => {
        moreMenuReceived.classList.add('hidden');
        moreMenuSent.classList.add('hidden');
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  });
  
  // Handle more menu - edit button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.more-edit-btn')) {
      const messageText = activeMessage.querySelector('span').textContent;
      
      chatInput.value = messageText;
      editingMessage = activeMessage;
      chatInput.focus();
      
      // Show edit preview
      editPreview.classList.remove('hidden');
      editPreview.querySelector('.edit-text').textContent = messageText;
      
      // Hide reply preview if showing
      replyPreview.classList.add('hidden');
      replyingTo = null;
      replyingToMessageElement = null;
      
      moreMenuSent.classList.add('hidden');
    }
  });
  
  // Handle more menu - unsend button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.more-unsend-btn')) {
      if (activeMessageWrapper) {
        activeMessageWrapper.remove();
        activeMessage = null;
        activeMessageWrapper = null;
      }
      
      moreMenuSent.classList.add('hidden');
    }
  });
  
  // Handle cancel reply
  cancelReplyBtn.addEventListener('click', () => {
    replyingTo = null;
    replyingToMessageElement = null;
    isReplyingToSelf = false;
    replyPreview.classList.add('hidden');
  });
  
  // Handle cancel edit
  cancelEditBtn.addEventListener('click', () => {
    editingMessage = null;
    editPreview.classList.add('hidden');
    chatInput.value = '';
  });
  
  // Add reply indicator styling
  const replyIndicatorStyle = document.createElement('style');
  replyIndicatorStyle.textContent = `
    .reply-indicator {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 4px;
      padding-left: 4px;
      border-left: 2px solid rgba(255, 255, 255, 0.3);
    }
  `;
  document.head.appendChild(replyIndicatorStyle);
});
