let cart = []
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


// Listagem das pizzas
pizzaJson.map((item, index) => {
    // Clona as estruturas (modelos) das pizzas e insere uma por uma (com suas próprias informações) na interface da página
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Insere as informações de cada pizza
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').setAttribute("src", item.img);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Evento de 'click' nas pizzas, para abrir o modal 
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        // Insere as informações da cada pizza (modal)
        c('.pizzaBig img').setAttribute('src', pizzaJson[key].img);
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

        // Tamanho GRANDE (tamanho da pizza) fica selecionado por padrão
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--qt').innerHTML = modalQt;

        // Exibe o modal na tela
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
})


// ---  EVENTOS DO MODAL:  --- //

// função de FECHAR o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', closeModal);
})

// DIMINUI quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
})

// AUMENTA quantidade de pizzas
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

// MARCA a opção de tamanho SELECIONADA 
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

// Função para ADICIONAR pizzas no carrinho de compras
c('.pizzaInfo--addButton').addEventListener('click', () => {
    // Armazena o tamanho das pizzas
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    // Identificador para que as pizzas do mesmo TIPO e TAMANHO fiquem JUNTAS
    let identifier = `${pizzaJson[modalKey].id}'@'${size}`;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

// Função que atualiza o carrinho de compras
function updateCart() {
    if (cart.length > 0) {      // Se TIVER alguma pizza no carrinho, o mesmo APARECE!
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item => item.id == cart[i].id));

            // Clona as estruturas (modelos) dos itens do carrinho e insere uma por uma (com suas próprias informações) no ASIDE da página
            let cartItem = c('.models .cart--item').cloneNode(true);

            // Identifica o tamanho das pizzas por LETRAS [P, M, G]
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            // Insere as informações de cada item do carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            c('aside .cart').append(cartItem);
        }
    } else {        // Se NÃO TIVER alguma pizza no carrinho, o mesmo DESAPARECE! 
        c('aside').classList.remove('show');
    }
}