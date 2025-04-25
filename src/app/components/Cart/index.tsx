'use client'

import React from 'react'
import OrderSummary from './OrderSummary'
import SingleItem from './SingleItem'
import Discount from './Discount'

export default function Cart( { item }) {
  // sử dụng localstorage để lưu mảng sản phẩm và query liên tục mỗi lần bấm tăng sản phẩm
  // Sử dụng các attribute trong mảng để tính toán giá total bằng method calculatePrice trong zustand store

  // TODO: increase decrease quantity
  // TODO: recalculate total dynamically
  // TODO: handle remove
  // TODO: set quantity
  // TODO: handle deletion

  return (
    <div>
        <OrderSummary />
        <SingleItem />
    </div>
  )
}
