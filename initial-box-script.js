window.onload = function () {
    const merrywrap = document.getElementById("merrywrap");
    const box = merrywrap.getElementsByClassName("giftbox")[0];
    let step = 1;
    const stepDurations = [3000, 2000, 1000, 500];

    // Handle animation done
    function onAnimationDone() {
        setTimeout(() => {
            merrywrap.style.display = 'block';
        }, 500);
    }

    // Add event listener for the animation done event
    document.getElementById('loader').addEventListener('animationDone', onAnimationDone);

    function init() {
        box.addEventListener("click", openBox);
    }

    function stepClass(step) {
        merrywrap.className = 'merrywrap step-' + step;
    }

    function openBox() {
        if (step === 1) {
            box.removeEventListener("click", openBox); // Remove listener after first click
        }
        stepClass(step);
        if (step === 4) {
            reveal();
        } else {
            setTimeout(() => {
                step++;
                openBox();
            }, stepDurations[step - 1]);
        }
    }

    function reveal() {
        merrywrap.style.backgroundColor = 'transparent';
        document.querySelector('.giftbox').style.display = 'none';

        if (typeof Loadr !== 'undefined' && typeof Loadr.stop === 'function') {
            Loadr.stop();
        }

        try {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('loadingText').style.display = 'none';
        } catch {
            console.log('sas')
        }

        const giraffe = document.querySelector('.giraffe');
        giraffe.style.display = 'block'; // Unhide the giraffe

        const fireworks = document.getElementById('birthday');
        fireworks.classList.remove('hidden');
        const yers = document.getElementById('yers');
        yers.classList.remove('hidden');

        init(); // Re-initialize event listeners if needed
    }

    init();
};
