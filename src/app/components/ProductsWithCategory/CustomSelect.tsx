import { ProductControllerGetAllProductParams } from '@/api/models';
import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';

type Option = {
  label: string;
  value: string | number;
  orderBy?: string;
  orderField?: string;
};

interface ICustomSelectProps {
  options: Option[];
  setParams: Dispatch<SetStateAction<ProductControllerGetAllProductParams>>;
}

const CustomSelect = ({ options, setParams }: ICustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const selectRef = useRef<HTMLDivElement | null>(null);

  // Function to close the dropdown when a click occurs outside the component
  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setParams((prev) => ({
      ...prev,
      orderField: option.orderField,
      orderBy: option.orderBy,
    }));
    toggleDropdown();
  };

  return (
    <div
      className="custom-select custom-select-2 flex-shrink-0 relative w-55"
      ref={selectRef}
    >
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? 'select-arrow-active' : ''
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </div>
      <div className={`select-items ${isOpen ? '' : 'select-hide'}`}>
        {options.slice(1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${
              selectedOption === option ? '!bg-gray-1 !text-dark' : ''
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
