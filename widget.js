document.addEventListener("DOMContentLoaded", function () {
  // Variables para el estado del chat
  let isChatOpen = false;
  let messages = [];

  // Crear estilos CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
    
    .clibot-typing {
      display: flex;
      gap: 4px;
      padding: 10px;
    }
    
    .clibot-typing span {
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }
    
    .clibot-typing span:nth-child(2) { animation-delay: 0.2s; }
    .clibot-typing span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);

  // Crear botón del chat
  const chatBtn = document.createElement("div");
  chatBtn.innerText = "💬";
  chatBtn.style.position = "fixed";
  chatBtn.style.bottom = "20px";
  chatBtn.style.right = "20px";
  chatBtn.style.backgroundColor = "#4f46e5";
  chatBtn.style.color = "white";
  chatBtn.style.width = "60px";
  chatBtn.style.height = "60px";
  chatBtn.style.borderRadius = "50%";
  chatBtn.style.cursor = "pointer";
  chatBtn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
  chatBtn.style.zIndex = "9999";
  chatBtn.style.fontFamily = "Arial, sans-serif";
  chatBtn.style.fontSize = "24px";
  chatBtn.style.display = "flex";
  chatBtn.style.alignItems = "center";
  chatBtn.style.justifyContent = "center";
  chatBtn.style.transition = "all 0.3s ease";
  chatBtn.style.animation = "pulse 2s infinite";

  // Crear ventana del chat
  const chatWindow = document.createElement("div");
  chatWindow.style.position = "fixed";
  chatWindow.style.bottom = "90px";
  chatWindow.style.right = "20px";
  chatWindow.style.width = "350px";
  chatWindow.style.height = "450px";
  chatWindow.style.backgroundColor = "white";
  chatWindow.style.borderRadius = "15px";
  chatWindow.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
  chatWindow.style.zIndex = "9998";
  chatWindow.style.display = "none";
  chatWindow.style.flexDirection = "column";
  chatWindow.style.overflow = "hidden";
  chatWindow.style.border = "1px solid #e2e8f0";

  // Header del chat
  const chatHeader = document.createElement("div");
  chatHeader.style.backgroundColor = "#4f46e5";
  chatHeader.style.color = "white";
  chatHeader.style.padding = "15px 20px";
  chatHeader.style.fontFamily = "Arial, sans-serif";
  chatHeader.style.fontWeight = "bold";
  chatHeader.style.fontSize = "16px";
  chatHeader.style.display = "flex";
  chatHeader.style.justifyContent = "space-between";
  chatHeader.style.alignItems = "center";
  chatHeader.innerHTML = `
    <div>
      <div>🤖 Asistente CliBot</div>
      <div style="font-size: 12px; opacity: 0.8; font-weight: normal;">Siempre disponible</div>
    </div>
    <div style="cursor: pointer; font-size: 20px;" id="clibot-close">✕</div>
  `;

  // Área de mensajes
  const chatMessages = document.createElement("div");
  chatMessages.style.flex = "1";
  chatMessages.style.padding = "20px";
  chatMessages.style.overflowY = "auto";
  chatMessages.style.backgroundColor = "#f8fafc";
  chatMessages.style.fontFamily = "Arial, sans-serif";
  chatMessages.style.fontSize = "14px";
  chatMessages.style.lineHeight = "1.5";

  // Área de input
  const chatInput = document.createElement("div");
  chatInput.style.padding = "15px";
  chatInput.style.borderTop = "1px solid #e2e8f0";
  chatInput.style.backgroundColor = "white";
  chatInput.innerHTML = `
    <div style="display: flex; gap: 10px;">
      <input type="text" id="clibot-input" placeholder="Escribe tu mensaje..." 
             style="flex: 1; padding: 10px 15px; border: 1px solid #e2e8f0; border-radius: 25px; outline: none; font-family: Arial, sans-serif; font-size: 14px;">
      <button id="clibot-send" 
              style="padding: 10px 15px; background: #4f46e5; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 16px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        ➤
      </button>
    </div>
  `;

  // Ensamblar el chat
  chatWindow.appendChild(chatHeader);
  chatWindow.appendChild(chatMessages);
  chatWindow.appendChild(chatInput);

  // Añadir elementos al DOM
  document.body.appendChild(chatBtn);
  document.body.appendChild(chatWindow);

  // Mensaje inicial
  function addMessage(text, isBot = true) {
    const messageDiv = document.createElement("div");
    messageDiv.style.marginBottom = "15px";
    messageDiv.style.display = "flex";
    messageDiv.style.justifyContent = isBot ? "flex-start" : "flex-end";
    
    const messageBubble = document.createElement("div");
    messageBubble.style.maxWidth = "80%";
    messageBubble.style.padding = "10px 15px";
    messageBubble.style.borderRadius = isBot ? "15px 15px 15px 5px" : "15px 15px 5px 15px";
    messageBubble.style.backgroundColor = isBot ? "#667eea" : "#e2e8f0";
    messageBubble.style.color = isBot ? "white" : "#333";
    messageBubble.textContent = text;
    
    messageDiv.appendChild(messageBubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "clibot-typing-container";
    typingDiv.style.marginBottom = "15px";
    typingDiv.innerHTML = `
      <div class="clibot-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
  }

  function hideTyping(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
      typingDiv.parentNode.removeChild(typingDiv);
    }
  }

  function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes("hola") || message.includes("buenas") || message.includes("hey")) {
      return "¡Hola! 👋 Soy el asistente de CliBot. ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros planes, funciones o resolver cualquier duda.";
    }
    
    if (message.includes("precio") || message.includes("plan") || message.includes("coste") || message.includes("cuanto")) {
      return "Tenemos 3 planes:\n\n🔹 Plan Emprendedor: €197/mes\n- Asistente en Telegram y web\n- 1 flujo principal\n\n🔸 Plan Profesional: €397/mes\n- Todo lo anterior + hasta 3 flujos\n- Seguimiento en Google Sheets\n\n🟣 Plan Empresarial: €600/mes\n- Asistente multicanal completo\n- IA avanzada y llamadas automáticas\n\n¿Te interesa algún plan en particular?";
    }
    
    if (message.includes("funciona") || message.includes("como") || message.includes("que hace")) {
      return "CliBot automatiza las respuestas de tu negocio en múltiples canales:\n\n✅ Respuestas automáticas en Telegram, WhatsApp, email y web\n✅ IA personalizada para tu sector\n✅ Gestión de pedidos y reservas\n✅ Seguimiento de clientes\n✅ Configuración en 5 minutos\n\n¿Quieres una demo gratuita?";
    }
    
    if (message.includes("demo") || message.includes("prueba") || message.includes("gratis") || message.includes("test")) {
      return "¡Perfecto! 🎉 Ofrecemos una prueba gratuita de 7 días sin necesidad de tarjeta de crédito.\n\nDurante la prueba tendrás acceso completo a:\n• Configuración personalizada\n• Soporte directo conmigo\n• Todas las funciones del plan elegido\n\n¿Te gustaría empezar ahora? Solo necesito tu email y te envío los accesos.";
    }
    
    if (message.includes("contacto") || message.includes("email") || message.includes("hablar") || message.includes("llamar")) {
      return "Puedes contactarme directamente:\n\n📧 Email: clibotcom@gmail.com\n💬 WhatsApp: Disponible para clientes\n🕒 Horario: 24/7 (respuesta automática)\n\nTambién puedes escribirme directamente por Telegram: @ClIAA_bot\n\n¿Prefieres que te llame o te envío más información por email?";
    }
    
    if (message.includes("whatsapp") || message.includes("telegram") || message.includes("canales")) {
      return "CliBot funciona en múltiples canales:\n\n📱 Telegram: Incluido en todos los planes\n💬 WhatsApp: Planes Profesional y Empresarial\n📧 Email: Automatización incluida\n🌐 Web: Widget como este chat\n📞 Llamadas: Solo Plan Empresarial\n\nCada canal se configura según tu negocio. ¿Cuál te interesa más?";
    }
    
    if (message.includes("gracias") || message.includes("perfecto") || message.includes("genial")) {
      return "¡De nada! 😊 Me alegra poder ayudarte. \n\nSi tienes más preguntas o quieres empezar con la prueba gratuita, solo dime. Estoy aquí para hacer que tu negocio sea más eficiente con IA.\n\n¿Hay algo más en lo que pueda ayudarte?";
    }
    
    // Respuesta por defecto
    return "Interesante pregunta. Como asistente de CliBot, puedo ayudarte con:\n\n• Información sobre planes y precios\n• Explicación de funciones\n• Configuración de prueba gratuita\n• Soporte técnico\n\n¿Sobre qué te gustaría saber más? También puedes contactar directamente: clibotcom@gmail.com";
  }

  // Event listeners
  chatBtn.addEventListener("click", function() {
    if (!isChatOpen) {
      chatWindow.style.display = "flex";
      chatWindow.style.animation = "slideUp 0.3s ease";
      chatBtn.innerText = "✕";
      isChatOpen = true;
      
      // Mensaje de bienvenida
      if (messages.length === 0) {
        setTimeout(() => {
          addMessage("¡Hola! 👋 Soy el asistente de CliBot. Estoy aquí para ayudarte con cualquier duda sobre nuestros servicios de automatización con IA. ¿En qué puedo ayudarte?");
          messages.push("welcome");
        }, 500);
      }
    } else {
      chatWindow.style.animation = "slideDown 0.3s ease";
      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 300);
      chatBtn.innerText = "💬";
      isChatOpen = false;
    }
  });

  // Cerrar chat
  document.addEventListener("click", function(e) {
    if (e.target.id === "clibot-close") {
      chatWindow.style.animation = "slideDown 0.3s ease";
      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 300);
      chatBtn.innerText = "💬";
      isChatOpen = false;
    }
  });

  // Enviar mensaje
  function sendMessage() {
    const input = document.getElementById("clibot-input");
    const message = input.value.trim();
    
    if (message) {
      addMessage(message, false);
      input.value = "";
      
      // Mostrar typing
      const typingDiv = showTyping();
      
      // Simular respuesta del bot
      setTimeout(() => {
        hideTyping(typingDiv);
        const response = getBotResponse(message);
        addMessage(response, true);
      }, 1000 + Math.random() * 1000);
    }
  }

  document.addEventListener("click", function(e) {
    if (e.target.id === "clibot-send") {
      sendMessage();
    }
  });

  document.addEventListener("keypress", function(e) {
    if (e.target.id === "clibot-input" && e.key === "Enter") {
      sendMessage();
    }
  });

  // Mensaje de confirmación en consola
  console.log("CliBot chat widget cargado correctamente!");
});
