import { ANIMATION, STACK } from './constants.js';

function initStack() {
    const all = Array.from(document.querySelectorAll('.swipe-wrapper'));
    all.forEach((cardEl, index) => {
        const baseZ = parseInt(cardEl.dataset.zIndex || 200, 10);
        cardEl.style.zIndex = baseZ - index;
        
        if (index < STACK.MAX_VISIBLE) {
            const scale = (STACK.SCALE_DENOMINATOR - index) / STACK.SCALE_DENOMINATOR;
            cardEl.style.transform = `scale(${scale}) translateY(-${STACK.TRANSLATE_Y_MULTIPLIER * index}px)`;
            cardEl.style.opacity = (STACK.OPACITY_DENOMINATOR - index) / STACK.OPACITY_DENOMINATOR;
            cardEl.style.visibility = 'visible';
        } else {
            cardEl.style.visibility = 'hidden';
            cardEl.style.transform = 'scale(0.8)';
            cardEl.style.opacity = '0';
        }
    });
}

function attachHammer(wrapper, onLeft, onRight) {
    if (typeof Hammer === 'undefined') return;
    const hammertime = new Hammer(wrapper);
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammertime.on('pan', (ev) => {
        wrapper.classList.add('moving');
        if (ev.deltaX === 0) return;
        if (ev.center.x === 0 && ev.center.y === 0) return;

        const xMulti = ev.deltaX * ANIMATION.ROTATION_MULTIPLIER_X;
        const yMulti = ev.deltaY / ANIMATION.ROTATION_MULTIPLIER_Y;
        const rotate = xMulti * yMulti;
        wrapper.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px) rotate(${rotate}deg)`;
    });

    hammertime.on('panend', (ev) => {
        wrapper.classList.remove('moving');

        const keep = Math.abs(ev.deltaX) < ANIMATION.SWIPE_THRESHOLD || Math.abs(ev.velocityX) < ANIMATION.VELOCITY_THRESHOLD;

        if (keep) {
            wrapper.style.transform = '';
            initStack();
        } else {
            wrapper.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px) rotate(${ev.deltaX * ANIMATION.ROTATION_MULTIPLIER_X * ev.deltaY / ANIMATION.ROTATION_MULTIPLIER_Y}deg)`;
            wrapper.classList.add('removed');
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const exitClass = ev.deltaX > 0 ? 'card-exit-right' : 'card-exit-left';
                    wrapper.classList.add(exitClass);
                    wrapper.style.transform = ''; 
                });
            });
            
            setTimeout(() => {
                wrapper.remove();
                if (ev.deltaX > 0) {
                    if (typeof onRight === 'function') onRight();
                } else {
                    if (typeof onLeft === 'function') onLeft();
                }
                initStack();
            }, ANIMATION.SWIPE_DURATION);
        }
    });
}

export { attachHammer, initStack };

