import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
    description?: string;
    emoji?: string;
    link?: string;
    title?: string;
}

function ListInfoCard({ description, emoji, link, title }: Props) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(link ?? '/');
    }
    return (
        <Card sx={{ width: 'fit-content' }}>
            <CardActionArea onClick={handleClick} sx={{ display: 'flex', width: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Typography component="div" variant="h5">
                            {title}
                        </Typography>
                        <Typography color='text.secondary' component='div'>
                            {description}
                        </Typography>
                    </CardContent>
                </Box>
                <Box sx={{padding: '0.5em'}}>
                    <Typography variant='h2' component='div'>
                        {emoji}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export default ListInfoCard