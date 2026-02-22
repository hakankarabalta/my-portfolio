const form = document.getElementById('contact-form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Sayfanın yenilenmesini engeller
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Lütfen bekleyin...";
  
  fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = "Mesajınız başarıyla gönderildi!";
        form.reset(); // İŞTE FORMU SIFIRLAYAN KOMUT BU!
      } else {
        result.innerHTML = json.message;
      }
    })
    .catch(error => {
      console.log(error);
      result.innerHTML = "Bir hata oluştu!";
    });
});