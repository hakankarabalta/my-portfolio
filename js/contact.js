const contactForm = document.getElementById('contact-form');
const result = document.getElementById('result');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Sayfanın yenilenmesini ve dış siteye gitmesini engeller

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.innerHTML = "Lütfen bekleyin...";
    result.style.display = "block"; // Eğer gizli yaptıysan görünür yap

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
                // Başarılı gönderim
                result.innerHTML = "Mesajınız başarıyla gönderildi!";
                result.style.color = "green";
                contactForm.reset(); // Formu tamamen sıfırlar
            } else {
                // Sunucu kaynaklı hata
                console.log(response);
                result.innerHTML = json.message;
                result.style.color = "red";
            }
        })
        .catch(error => {
            // Bağlantı hatası
            console.log(error);
            result.innerHTML = "Bir hata oluştu, lütfen internet bağlantınızı kontrol edin.";
            result.style.color = "red";
        })
        .then(() => {
            // 5 saniye sonra "Mesaj gönderildi" yazısını otomatik kaldırmak istersen:
            setTimeout(() => {
                result.style.display = "none";
            }, 5000);
        });
});
