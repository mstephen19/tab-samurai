import { styled, ListItem, type ListItemProps, type ListProps, List, ListItemText } from '@mui/material';

export const BasicListItem = styled((props: ListItemProps) => <ListItem {...props} disableGutters disablePadding />)({
    gap: '10px',
    userSelect: 'none',
});

export const BasicList = styled((props: ListProps) => <List dense disablePadding {...props} />)();

export const BasicListItemText = styled(ListItemText)({
    '& .MuiListItemText-primary': {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    '& .MuiListItemText-secondary': {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        cursor: 'pointer',
    },
});
