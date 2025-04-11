import { Breadcrumbs } from '@mui/material'
import Link from 'next/link'
import React from 'react'

export default function ProductListBreadcrumbs() {
  return (
    <div>
      <Breadcrumbs>
            <Link href={"/"}>
            Home
            </Link>

            <Link href={"#"}>
            Product List
            </Link>

        </Breadcrumbs>
    </div>
  )
}
