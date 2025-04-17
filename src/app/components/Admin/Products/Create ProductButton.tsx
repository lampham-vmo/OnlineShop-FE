'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  TextField,
} from '@mui/material';
import { getProduct } from '@/generated/api/endpoints/product/product';
import {
  CategoryResponseDto,
  ProductRequest,
  UploadControllerUploadImageBody,
} from '@/generated/api/models';
import { getUpload } from '@/generated/api/endpoints/upload/upload';
import toast from 'react-hot-toast';
import { getCategory } from '@/generated/api/endpoints/category/category';
import { productControllerCreateProductBody } from '@/generated/api/schemas/product/product.zod';
import { ZodError } from 'zod';
import { error } from 'console';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  m: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

export default function BasicModal() {
  const { productControllerCreateProduct } = getProduct();
  const { categoryControllerGetAll } = getCategory();
  const { uploadControllerUploadImage } = getUpload();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [imageLink, setImageLink] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<CategoryResponseDto[]>([]);
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadControllerUploadImageBody | null>(null);
  const [formData, setFormData] = React.useState<ProductRequest>({
    name: '',
    description: '',
    stock: 0,
    price: 0,
    discount: 0,
    image: '',
    categoryId: -1,
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const validImages = Array.from(files).filter((file) =>
        file.type.startsWith('image/'),
      );
      if (validImages.length !== files.length) {
        toast.error('Chỉ được upload file ảnh!');
        return;
      }
      for (const file of validImages) {
        if (imageLink.length >= 3) {
          toast.error('Chỉ được upload tối đa 3 ảnh!');
          break;
        }

        const body = { file }; // file: File
        const res = await toast.promise(
          async () => {
            const res = await uploadControllerUploadImage(body);
            return res;
          },
          {
            loading: 'Loading',
            success: 'Upload Success',
            error: 'Upload Failed',
          },
        );
        setImageLink((prev) => {
          const updated = [...prev, res.data];
          setFormData((form) => ({
            ...form,
            image: JSON.stringify(updated),
          }));
          return updated;
        });
      }
    }
  };

  const getAllCategory = async () => {
    const data = await categoryControllerGetAll();
    setCategories(data.data);
    return data.data;
  };

  const handleChange = (field: string) => (event: any) => {
    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    if (['stock', 'price', 'discount', 'categoryId'].includes(field)) {
      value = Number(value);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};

    // Check image
    if (imageLink.length === 0) {
      errors.image = 'Image must have at least 1';
    }
    if (formData.categoryId === -1) {
      errors.categoryId = 'You must select one';
    }

    try {
      const validData = productControllerCreateProductBody.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    // Nếu không có lỗi thì gọi API
    // Gọi API nếu không có lỗi
    try {
      setFormErrors({});
      await toast.promise(productControllerCreateProduct(formData), {
        loading: 'Đang tạo sản phẩm...',
        success: 'Tạo sản phẩm thành công!',
      });
      setFormData({
        name: '',
        description: '',
        stock: 0,
        price: 0,
        discount: 0,
        image: '',
        categoryId: -1,
      });
      setImageLink([]);
      setFormErrors({});
      setTimeout(() => {
        handleClose();
      }, 600); // 100ms delay
    } catch (error: any) {
      // 🧠 Bắt lỗi từ API
      const apiMessage =
        error?.response?.data?.error?.message ||
        'Đã xảy ra lỗi khi tạo sản phẩm.';
      toast.error(apiMessage);
    }
  };

  React.useEffect(() => {
    getAllCategory();
    console.log(uploadedFiles);
  }, [imageLink, formData]);
  return (
    <div className="flex justify-end mb-2">
      <Button onClick={handleOpen} variant="contained">
        Create Product
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style}>
          <Typography variant="h6" sx={{ width: '100%' }}>
            Create Product
          </Typography>

          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!formErrors.name}
            required
            helperText={formErrors.name}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            error={!!formErrors.description}
            helperText={formErrors.description}
            required
          />

          <TextField
            fullWidth
            label="Stock"
            type="number"
            inputProps={{ min: 0 }}
            value={formData.stock == 0 ? '' : formData.stock}
            error={!!formErrors.stock}
            helperText={formErrors.stock}
            onChange={handleChange('stock')}
          />

          <FormControl fullWidth>
            <InputLabel htmlFor="price">Price</InputLabel>
            <OutlinedInput
              id="price"
              type="number"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Price"
              error={!!formErrors.price}
              inputProps={{ min: 0, step: '0.01' }}
              value={formData.price == 0 ? '' : formData.price}
              onChange={handleChange('price')}
            />
            {formErrors.price && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {formErrors.price}
              </FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Discount (%)"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            error={!!formErrors.discount}
            value={formData.discount == 0 ? '' : formData.discount}
            onChange={handleChange('discount')}
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Button>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {imageLink.map((link, index) => (
              <Box key={index}>
                <img
                  src={link}
                  alt={`Uploaded ${index + 1}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </Box>
            ))}
          </Box>

          {formErrors.image && (
            <Typography variant="caption" color="error">
              {formErrors.image}
            </Typography>
          )}

          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={formData.categoryId}
              label="Category"
              onChange={handleChange('categoryId')}
              required
            >
              <MenuItem value={-1}>Select Category</MenuItem>
              {categories.map((category) => (
                <MenuItem value={category.id}>{category.name}</MenuItem>
              ))}
              {/* Thay bằng danh sách động từ API nếu cần */}
            </Select>
            {formErrors.categoryId && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {formErrors.categoryId}
              </FormHelperText>
            )}
          </FormControl>

          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
