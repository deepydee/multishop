(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

import {Catalog} from './catalog.js';
import { Cart } from './cart.js';

const url = '../data/goods.json';
const options = {
    renderCartOnInit: true,
    renderMenuCartOnInit: true,
    shippingPrice: 10,
    elAddToCart: '.add-to-cart',
    attrId: 'id',
    attrName: 'name',
    attrPrice: 'price',
    attrDelta: 'delta',
    elCart: '#cart',
    elGoods: '#goods',
    elTotalCartCount: '.total-cart-count',
    elSubtotalCartSum: '#subtotal-cart-summ',
    elShippingSum: '#shipping',
    elTotalCartSum: '#total-cart-summ',
    elCartItem: '.cart-item',
    elCartCount: '.count',
    elCartSum: '.summ',
    elChangeCount: '.change-count',
    elRemoveFromCart: '.remove-from-cart',
    elOrder: '#order',
  };
  
const page = location.pathname.split("/")[1].slice(0, -5);

const optionsCatalog = {
    ...options,
    renderCartOnInit: false,
    renderMenuCartOnInit: true,
};

const optionsCart = {
    ...options,
    renderCartOnInit: true,
    renderMenuCartOnInit: true,
};

switch (page) {
    case 'shop': {
        const catalog = new Catalog(url);
        const cart = new Cart(optionsCatalog);
        break;
    }
    case 'cart': {
        const cart = new Cart(optionsCart);
        break;
    }
}
