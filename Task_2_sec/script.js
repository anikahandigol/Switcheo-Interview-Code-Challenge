// script.js
document.addEventListener('DOMContentLoaded', () => {
  const inputTokenSelect = document.getElementById('input-token');
  const outputTokenSelect = document.getElementById('output-token');
  const inputTokenIcon = document.getElementById('input-token-icon');
  const outputTokenIcon = document.getElementById('output-token-icon');
  const inputOptions = document.getElementById('input-options');
  const outputOptions = document.getElementById('output-options');
  const inputTrigger = document.getElementById('input-token-trigger');
  const outputTrigger = document.getElementById('output-token-trigger');
  const inputAmount = document.getElementById('input-amount');
  const outputAmount = document.getElementById('output-amount');
  const confirmSwapButton = document.getElementById('confirm-swap');
  const walletModal = document.getElementById('walletModal');
  const closeModalButton = document.querySelector('.modal .close');
  const walletForm = document.getElementById('wallet-form');

  let tokenPrices = {};

  const fetchImagesAndPrices = async () => {
    try {
      const repoOwner = 'Switcheo'; // Replace with the owner of the repository
      const repoName = 'token-icons'; // Replace with the name of the repository
      const folderPath = 'tokens'; // Replace with the path to the folder containing the images
      const pricesUrl = 'https://interview.switcheo.com/prices.json'; // URL to fetch token prices

      const [imagesResponse, pricesResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`),
        fetch(pricesUrl)
      ]);

      const imagesData = await imagesResponse.json();
      tokenPrices = await pricesResponse.json();

      const imageFiles = imagesData.filter(file => 
        file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.svg')
      );

      imageFiles.forEach(image => {
        const optionElement = document.createElement('div');
        optionElement.className = 'custom-option';
        const tokenName = image.name.replace(/\.[^/.]+$/, ""); // remove file extension
        optionElement.dataset.value = image.download_url;
        optionElement.dataset.token = tokenName; // Add token name to dataset
        optionElement.innerHTML = `<img src="${image.download_url}" alt="${tokenName}" /><span>${tokenName}</span>`;

        optionElement.addEventListener('click', (e) => {
          const parentSelect = e.target.closest('.custom-select');
          const trigger = parentSelect.querySelector('.custom-select-trigger');
          const icon = parentSelect.querySelector('.token-icon');
          const options = parentSelect.querySelector('.custom-options');
          trigger.querySelector('span').textContent = tokenName;
          icon.src = image.download_url;
          options.classList.remove('open');
          updateOutputAmount(); // Call conversion function on selection
        });

        inputOptions.appendChild(optionElement.cloneNode(true));
        outputOptions.appendChild(optionElement);
      });

      // Add event listeners to toggle the custom options
      inputTrigger.addEventListener('click', () => {
        inputOptions.classList.toggle('open');
      });

      outputTrigger.addEventListener('click', () => {
        outputOptions.classList.toggle('open');
      });

      // Close options if clicked outside
      document.addEventListener('click', (e) => {
        if (!inputTokenSelect.contains(e.target)) {
          inputOptions.classList.remove('open');
        }
        if (!outputTokenSelect.contains(e.target)) {
          outputOptions.classList.remove('open');
        }
      });

      // Convert amount on input change
      inputAmount.addEventListener('input', updateOutputAmount);

      // Confirm swap button click handler
      confirmSwapButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateInput()) {
          updateOutputAmount(true); // Perform conversion
          openModal();
        } else {
          alert('Please enter a valid amount and select both tokens.');
        }
      });

      // Wallet form submission handler
      walletForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Wallet connected and swap confirmed!');
        closeModal();
      });

      // Close modal when close button is clicked
      closeModalButton.addEventListener('click', closeModal);

      // Close modal when clicking outside of the modal content
      window.addEventListener('click', (e) => {
        if (e.target === walletModal) {
          closeModal();
        }
      });

    } catch (error) {
      console.error('Error fetching images or prices:', error);
    }
  };

  const updateOutputAmount = (confirm = false) => {
    const inputToken = inputTokenSelect.querySelector('.custom-select-trigger span').textContent;
    const outputToken = outputTokenSelect.querySelector('.custom-select-trigger span').textContent;
    const amountToSend = parseFloat(inputAmount.value);

    if (tokenPrices[inputToken] && tokenPrices[outputToken] && !isNaN(amountToSend) && amountToSend > 0) {
      const inputPrice = tokenPrices[inputToken];
      const outputPrice = tokenPrices[outputToken];
      const amountToReceive = (amountToSend * inputPrice) / outputPrice;
      outputAmount.value = amountToReceive.toFixed(6); // Display the converted amount
    } else {
      outputAmount.value = '';
      if (confirm) {
        alert('Invalid input. Please enter a valid amount and select both tokens.');
      }
    }
  };

  const validateInput = () => {
    const inputToken = inputTokenSelect.querySelector('.custom-select-trigger span').textContent;
    const outputToken = outputTokenSelect.querySelector('.custom-select-trigger span').textContent;
    const amountToSend = parseFloat(inputAmount.value);

    return tokenPrices[inputToken] && tokenPrices[outputToken] && !isNaN(amountToSend) && amountToSend > 0;
  };

  const openModal = () => {
    walletModal.style.display = 'block';
  };

  const closeModal = () => {
    walletModal.style.display = 'none';
  };

  fetchImagesAndPrices();
});
