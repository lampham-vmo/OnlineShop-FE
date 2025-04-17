'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  TextField,
  Box as MuiBox,
  IconButton,
} from '@mui/material';
import { getProduct } from '@/generated/api/endpoints/product/product';
import { getUpload } from '@/generated/api/endpoints/upload/upload';
import {
  CategoryResponseDto,
  ProductRequest,
  ProductResponse,
  UploadControllerUploadImageBody,
} from '@/generated/api/models';
import toast from 'react-hot-toast';
import { getCategory } from '@/generated/api/endpoints/category/category';
import { ZodError } from 'zod';
import {
  productControllerCreateProductBody,
  productControllerUpdateProductDetailParams,
} from '@/generated/api/schemas/product/product.zod';

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
  position: 'absolute' as const,
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
  flexDirection: 'column' as const,
  gap: '10px',
};

interface UpdateProductModalProps {
  initialData: ProductResponse;
  onSuccess?: () => void;
}

export default function UpdateProductModal({
  initialData,onSuccess
}: UpdateProductModalProps) {
  const { productControllerUpdateProductDetail } = getProduct();
  const { categoryControllerGetAll } = getCategory();
  const { uploadControllerUploadImage } = getUpload();

  const [open, setOpen] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [imageLink, setImageLink] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<CategoryResponseDto[]>([]);

  const [formData, setFormData] = React.useState<ProductRequest>({
    name: initialData.name,
    description: initialData.description,
    stock: initialData.stock,
    price: initialData.price,
    discount: initialData.discount,
    image: initialData.image,
    categoryId: -1,
  });
  const parsedImages: string[] = (() => {
    try {
      const result = JSON.parse(formData.image);
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  })();
  React.useEffect(() => {
    categoryControllerGetAll().then((res) => {
      setCategories(res.data);
      setFormData((prev) => ({
        ...prev,
        categoryId:
          categories.find((c) => c.name === initialData.categoryName)?.id ?? -1,
      }));
      console.log(formData.categoryId);
    });
    setImageLink(parsedImages);
  }, [open]);

  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field: string) => (e: any) => {
    let value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (['stock', 'price', 'discount', 'categoryId'].includes(field)) {
      value = Number(value);
      console.log(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length !== files.length) {
      toast.error('Chỉ được upload file ảnh!');
      return;
    }
    for (const file of valid) {
      if (imageLink.length >= 3) {
        toast.error('Chỉ được upload tối đa 3 ảnh!');
        break;
      }
      const res = await toast.promise(
        () => uploadControllerUploadImage({ file }),
        {
          loading: 'Loading',
          success: 'Upload Success',
          error: 'Upload Failed',
        },
      );
      setImageLink((prev) => {
        const updated = [...prev, res.data];
        setFormData((f) => ({ ...f, image: JSON.stringify(updated) }));
        return updated;
      });
    }
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
  
    // Validate với Zod
    try {
      console.log(formData)
      if(formData.name.trim()==""){
        errors.name = "Name should not be empty"
      }
      if(formData.description.trim() == ""){
        errors.description = "Description should not be empty"
      }
      productControllerCreateProductBody.parse(formData);
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
      console.log(errors)
      setFormErrors(errors);
      toast.error('Please check again');
      return;
    }
  
    // Gọi API tạo sản phẩm
    try {
      setFormErrors({});
      await toast.promise(productControllerUpdateProductDetail(initialData.id, formData), {
        loading: 'Updating....',
        success: 'Update Successful',
      });
  
      // Reset form sau khi thành công
      setFormData({
        name: '',
        description: '',
        stock: 0,
        price: 0,
        discount: 0,
        image: '',
        categoryId: -1,
      })
      setImageLink([]);
      setFormErrors({});
      onSuccess?.();
      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (error: any) {
      // ✅ Xử lý lỗi trả về từ API (message là array hoặc string)
      const message = error?.message;
  
      if (Array.isArray(message)) {
        toast.error(message.join('\n'));
      } else if (typeof message === 'string') {
        toast.error(message);
      } else {
        toast.error('Đã xảy ra lỗi khi tạo sản phẩm.');
      }
    }
  };  

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleOpen}>
        Edit
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box component="form" sx={style}>
          <Typography variant="h6">Update Product</Typography>
          <TextField
            label="Product Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!formErrors.name}
            helperText={formErrors.name}
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            multiline
            rows={4}
            onChange={handleChange('description')}
            error={!!formErrors.description}
            helperText={formErrors.description}
            fullWidth
          />
          <TextField
            label="Stock"
            type="number"
            value={formData.stock === 0 ? '' : formData.stock}
            onChange={handleChange('stock')}
            error={!!formErrors.stock}
            helperText={formErrors.stock}
            fullWidth
          />
          <FormControl fullWidth error={!!formErrors.price}>
            <InputLabel htmlFor="price">Price</InputLabel>
            <OutlinedInput
              id="price"
              type="number"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              value={formData.price === 0 ? '' : formData.price}
              onChange={handleChange('price')}
            />
            <FormHelperText>{formErrors.price}</FormHelperText>
          </FormControl>
          <TextField
            label="Discount (%)"
            type="number"
            value={formData.discount}
            onChange={handleChange('discount')}
            error={!!formErrors.discount}
            helperText={formErrors.discount}
            fullWidth
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Button>
          <MuiBox className="flex flex-wrap gap-2">
            {imageLink.map((url, i) => (
              <MuiBox key={i} className="relative">
                <img
                  src={url}
                  alt={`img-${i}`}
                  className="w-16 h-16 object-cover rounded"
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    const updated = imageLink.filter((_, index) => index !== i);
                    setImageLink(updated);
                    setFormData((prev) => ({
                      ...prev,
                      image: JSON.stringify(updated),
                    }));
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                    padding: '2px',
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </MuiBox>
            ))}
          </MuiBox>
          {formErrors.image && (
            <Typography color="error" variant="caption">
              {formErrors.image}
            </Typography>
          )}
          <FormControl fullWidth error={!!formErrors.categoryId}>
            <InputLabel id="cat-label">Category</InputLabel>
            <Select
              labelId="cat-label"
              value={formData.categoryId}
              onChange={handleChange('categoryId')}
            >
              <MenuItem value={-1}>Select Category</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.categoryId}</FormHelperText>
          </FormControl>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
