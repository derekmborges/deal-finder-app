import { Dialog, Typography, Button, Slide, TextField, CircularProgress, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Theme, useTheme } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system';
import axios from 'axios';
import { SavingsCategory } from '../../models/search';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(category: string, categories: readonly string[], theme: Theme) {
    return {
        fontWeight:
        categories.indexOf(category) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    };
}

type Props = {
    open: boolean;
    onClose: (saved: boolean) => void;
}

export default function HomeDepotSearchModal({ open, onClose }: Props) {
    const theme = useTheme();
    const [searchPhrase, setSearchPhrase] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [saving, setSaving] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        onClose(false);
    };

    const categoriesSelected = (event: SelectChangeEvent<typeof selectedCategories>) => {
        const { target: { value } } = event;

        let newValues: string[] = typeof value === 'string' ? value.split(',') : value;

        if (!selectedCategories.includes(SavingsCategory.ALL) && newValues.includes(SavingsCategory.ALL)) {
            newValues = [SavingsCategory.ALL];
        } else if (selectedCategories.includes(SavingsCategory.ALL) && newValues.length > 0) {
            newValues = newValues.filter(v => v !== SavingsCategory.ALL);
        }

        setSelectedCategories(newValues);
    }

    const addSearchPhrase = async () => {
        setSaving(true);
        const data = {
            "phrase": searchPhrase,
            "categories": selectedCategories
        }
        const response = await axios.post('https://homedepotdealfinder.derekmborges.repl.co/api/searches', data);
        if (response.status == 200 && response.data.ok) {
            setSaving(false);
            onClose(true);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4
            }}>
                <Typography sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }} variant="h6" component="div">
                    Home Depot Search
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 400,
                }}>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="search"
                        label="Product search phrase"
                        variant="filled"
                        value={searchPhrase}
                        onChange={(e) => setSearchPhrase(e.target.value)}
                    />

                    <FormControl fullWidth sx={{ m: 2 }}>
                        <InputLabel id="categories-label">Categories</InputLabel>
                        <Select
                            labelId="categories-label"
                            id="categories-select"
                            multiple
                            value={selectedCategories}
                            onChange={categoriesSelected}
                            input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {Object.values(SavingsCategory).map((category) => (
                                <MenuItem
                                    key={category}
                                    value={category}
                                    style={getStyles(category, selectedCategories, theme)}
                                >
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        fullWidth
                        color="warning"
                        variant='contained'
                        onClick={addSearchPhrase}
                        disabled={(!searchPhrase && selectedCategories.length === 0) || (saving !== null && saving)}>
                        { saving
                            ? <CircularProgress size="1.5rem" />
                            : 'Add to Deal Finder'
                        }
                    </Button>
                </Box>

            </Box>
        </Dialog>
    )
}
