import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function Information(config : Config) {
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {config.title} 
        </Typography>
        <Typography component="p" variant="h4">
            {config.value}
        </Typography>
    </Paper> 
    )
}

interface Config {
    title?: String;
    value: String;
}