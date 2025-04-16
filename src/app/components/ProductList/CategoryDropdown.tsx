'use client';


import { CategoryResponseDto } from '@/generated/api/models';
import { useState } from 'react';

interface PropCateCard {
  category: CategoryResponseDto;
  selected: boolean;
  onSelect: (id: number) => void;
}

const CategoryItem = ({ category, selected, onSelect }: PropCateCard) => {
  return (
    <button
      className={`${
        selected ? 'text-blue' : ''
      } group flex items-center justify-between ease-out duration-200 hover:text-blue`}
      onClick={() => {
        console.log(category.id);
        onSelect(category.id);
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selected ? 'border-blue bg-blue' : 'bg-white border-gray-3'
          }`}
        >
          <svg
            className={selected ? 'block' : 'hidden'}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span>{category.name}</span>
      </div>

      <span
        className={`${
          selected ? 'text-white bg-blue' : 'bg-gray-2'
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      />
    </button>
  );
};

interface PropsCate {
  categories: CategoryResponseDto[];
  onCategoryChange: (id: number | undefined) => void;
}

const CategoryDropdown = ({ categories, onCategoryChange }: PropsCate) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const handleSelect = (id: number) => {
    const isDeselecting = selectedCategoryId === id;
    const newSelectedId = isDeselecting ? null : id;

    setSelectedCategoryId(newSelectedId);
    onCategoryChange(isDeselecting ? undefined : id);
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown ? 'shadow-filter' : ''
        }`}
      >
        <p className="text-dark">Category</p>
        <button
          aria-label="button for category dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown ? 'rotate-180' : ''
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${toggleDropdown ? 'flex' : 'hidden'}`}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            selected={selectedCategoryId === category.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
