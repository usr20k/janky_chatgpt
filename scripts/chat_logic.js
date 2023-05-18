async function generateText() {

    // Create a div for your query:
    const responseDiv = document.getElementById('response');
    const text = document.getElementById('text').value;
    const q = createCard("You", "#ebf4f5", text);
    responseDiv.insertBefore(q, responseDiv.children[1]);

    // Show the spinner: 
    document.getElementById('spinner').style.display = '';
    document.getElementById('chat-input-form').reset();
    try {

      const response = await fetch('/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();

      //Format for HTML:
      data.response = data.response.replace(/\n/g, "<br />");

      // Create a div for the response:
      const d = createCard("JankyGPT", "#f3ebf5", data.response);
      responseDiv.insertBefore(d, responseDiv.children[1]);
      
    } catch (error) {
      console.error(error);
    }

    // Hide the spinner: 
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('text').reset();
    
  }

  function createCard(owner, color, content) {
    const d = document.createElement('div');
    d.className = "card";
    d.style.margin = '15px';
    d.innerHTML = '<div class="card-header" style="background-color: ' + color + '"><b>' + owner + '</b></div><div class="card-body"><p class="card-text">' + content + '</p></div>';
    return d
  }