'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Box as MuiBox,
  TextField,
  IconButton,
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
function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <MuiBox
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <img
        src={url}
        alt={`img-${index}`}
        className="w-16 h-16 object-cover rounded cursor-move"
      />
      <IconButton
        size="small"
        onClick={() => onRemove(index)}
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
  );
}

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
    setFormErrors({});
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

    // Validate với Zod
    try {
      console.log(formData);
      if (formData.name.trim() == '') {
        errors.name = 'Name should not be empty';
      }
      if (formData.description.trim() == '') {
        errors.description = 'Description should not be empty';
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
      console.log(errors);
      setFormErrors(errors);
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    // Gọi API tạo sản phẩm
    try {
      setFormErrors({});
      await toast.promise(productControllerCreateProduct(formData), {
        loading: 'Đang tạo sản phẩm...',
        success: 'Tạo sản phẩm thành công!',
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
      });
      setImageLink([]);
      setFormErrors({});
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
            multiline
            rows={4}
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
            value={formData.discount}
            onChange={handleChange('discount')}
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Images
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Button>
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = imageLink.findIndex(
                  (url) => url === active.id,
                );
                const newIndex = imageLink.findIndex((url) => url === over?.id);
                const reordered = arrayMove(imageLink, oldIndex, newIndex);
                setImageLink(reordered);
                setFormData((prev) => ({
                  ...prev,
                  image: JSON.stringify(reordered),
                }));
              }
            }}
          >
            <SortableContext
              items={imageLink}
              strategy={verticalListSortingStrategy}
            >
              <MuiBox className="flex flex-wrap gap-2">
                {imageLink.map((url, index) => (
                  <SortableImage
                    key={url}
                    url={url}
                    index={index}
                    onRemove={(i) => {
                      const updated = imageLink.filter((_, idx) => idx !== i);
                      setImageLink(updated);
                      setFormData((prev) => ({
                        ...prev,
                        image: JSON.stringify(updated),
                      }));
                    }}
                  />
                ))}
              </MuiBox>
            </SortableContext>
          </DndContext>

          {formErrors.image && (
            <Typography variant="caption" color="error">
              {formErrors.image}
            </Typography>
          )}

          <FormControl fullWidth>
            <InputLabel error={!!formErrors.categoryId} id="category-label">
              Category
            </InputLabel>
            <Select
              error={!!formErrors.categoryId}
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
