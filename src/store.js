import Vue from 'vue'
import Vuex from 'vuex'

export const CATEGORY_SELECTED_MENU = 'CATEGORY_SELECTED_MENU'
export const ITEM_ADD_SHOPPING = 'ITEM_ADD_SHOPPING'
export const PRODUCT_SELECTED_SEARCH = 'PRODUCT_SELECTED_SEARCH'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    itemCategorySelectedMenu: {},
    itemAddShopping: {},
    itemProductSelected: {},
  },
  mutations: {
    [CATEGORY_SELECTED_MENU]: (state, itemCategorySelectedMenu) => {
      state.itemCategorySelectedMenu = itemCategorySelectedMenu
    },
    [ITEM_ADD_SHOPPING]: (state, itemAddShopping) => {
      state.itemAddShopping = itemAddShopping
    },
    [PRODUCT_SELECTED_SEARCH]: (state, itemProductSelected) => {
      state.itemProductSelected = itemProductSelected
    }
  },
  actions: {

  }
})
