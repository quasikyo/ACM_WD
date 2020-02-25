// createElem(tagname, id=null, ...classes)
// Using ... here causes all additional elements to be put into an array (like Java varargs)
// If ... is used, then inside the method `classes` is an array containg all extra parameters
// and `...classes` is all elements in the `classes` array
// const createElem = (tagname, id=null, ...classes) => {
//     const elem = document.createElement('h5');
//     elem.id = id ? id : '';  // use the id if it's valid, blank otherwise
//     elem.className = classes.join(' ');
// };

// createElem(tagname, options)
const createElem = (tagname, attrs, content) => {
    const elem = document.createElement(tagname);
    // Set attributes
    Object.entries(attrs).forEach((opt) => {
        elem.setAttribute(opt[0], opt[1]);
    });
    // Set content
    // innerHTML: there may be HTML tags in here, treat them as such
    // textContent: this is all text, so escape all HTML
    const contType = content.type === 'textContent' ? 'textContent' : 'innerHTML';
    elem[contType] = content.content;
    return elem;
};

const modalAnimHandler = function(eAnim) {
    const classes = this.classList;
    if (classes.contains('anim-in')) {
        // Remove class after animating in
        classes.remove('anim-in');
    } else {
        // Remove class (not needed) and delete element
        classes.remove('anim-out');
        this.remove();
    }
};

const btnHandler = function(eBtn) {
    // Can use btn (closures), this (OOP & normal function), e.target (event object), e.currentTarget (event object)
    const parentHTML = eBtn.currentTarget.parentNode.innerHTML; // typeof parentHTML === 'string'
    const parentH5 = (new DOMParser()).parseFromString(parentHTML, 'text/html').querySelector('h5');

    // Using spread on an array here would cause all elements in an array to be passed in as it's own parameter
    // createElem('no', null, 'modal');

    // Create span to hold model content
    const modalContent = createElem('span', { class: 'modal__content' }, {
        type: 'textContent',
        content: `${parentH5.textContent} is a great service.`
    });
    // Make a modal using the h5 HTML and modalContent HTML, start animation with .anim-in
    const modal = createElem('section', { class: 'modal anim-in', }, {
        type: 'innerHTML',
        content: parentH5.outerHTML + modalContent.outerHTML
    });

    // Add an animation listener that will take care of removing class names and deleting the element
    modal.addEventListener('animationend', modalAnimHandler);

    // Add the modal to the DOM
    document.body.appendChild(modal);

    // Prevent additional modals from opening more modals
    eBtn.currentTarget.removeEventListener('click', btnHandler);

    window.addEventListener('click', (eWin) => {
        // If we click on anything that is not the modal or respective button (closures)
        if (eWin.target !== eBtn.target && eWin.target !== modal) {
            modal.classList.add('anim-out');
            // Allow the button to open modals again
            eBtn.target.addEventListener('click', btnHandler);
            // Not sure why it has to be `target` and can't be `currentTarget`.
            // Maybe because `currentTarget` is an object that references
            // the object that the event listener is on if and only if
            // the event is the most recent one.
        }
    });
};

const buttons = document.querySelectorAll('.card button');
buttons.forEach((btn) => {
    btn.addEventListener('click', btnHandler);
});