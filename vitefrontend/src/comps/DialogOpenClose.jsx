import { useState } from "react";
import React from 'react'

const DialogOpenClose = () => {
    const [open, setOpen] = useState(false);
    return { open, setOpen }
}

export default DialogOpenClose