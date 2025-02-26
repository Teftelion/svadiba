document.addEventListener("DOMContentLoaded", function () {
    const dots = document.querySelectorAll('.dot');
    const images = document.querySelectorAll('.image');
    let isScrolling = false;

    function updateActiveDot() {
        if (isScrolling) return;
        let middleScreen = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        images.forEach((img, i) => {
            const rect = img.getBoundingClientRect();
            const imgMiddle = rect.top + rect.height / 2;
            let distance = Math.abs(imgMiddle - middleScreen);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        });

        dots.forEach(dot => dot.classList.remove('active'));
        dots[closestIndex].classList.add('active');
    }

    // Плавный скролл при клике на точку
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                isScrolling = true;
                const offset = targetElement.offsetTop - (window.innerHeight / 2) + (targetElement.clientHeight / 2);
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                    updateActiveDot();
                }, 600);
            }
        });
    });

    // Обновление точек при скролле
    window.addEventListener('scroll', () => {
        isScrolling = false;
        updateActiveDot();
    });

    // Вызов при загрузке страницы
    setTimeout(updateActiveDot, 100);

    // === ФОРМА RSVP ===
    document.getElementById('rsvp-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => { data[key] = value });

        fetch('http://127.0.0.1:5000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            document.getElementById('response-message').textContent = 'Ваш ответ отправлен!';
            document.getElementById('rsvp-form').reset();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            document.getElementById('response-message').textContent = 'Ошибка при отправке!';
        });
    });
});
