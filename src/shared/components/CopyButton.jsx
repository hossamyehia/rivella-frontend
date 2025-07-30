import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';

function CopyButton({ label, text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <div style={{ direction: 'rtl', textAlign: "right", fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: label ? "8px" : "0px" }}>
            <Typography variant='caption'>{label}</Typography>
            <IconButton color='inherit' onClick={handleCopy} size="small">
                {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
            </IconButton>
        </div>
    );
}

export default CopyButton;