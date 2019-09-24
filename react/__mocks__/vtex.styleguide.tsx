import React, { FC } from 'react'

export const Button: FC<any> = ({ children, onClick }) => (
  <button onClick={onClick}>
    {children}
  </button>
)

export const Spinner: FC<any> = ({ }) => (
  <div>Spinner</div>
)

export const Input: FC<any> = ({ }) => (
  <div>Input</div>
)

export const Radio: FC<any> = ({ }) => (
  <div>Radio</div>
)
