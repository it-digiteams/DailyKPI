const { google } = require("googleapis");

const credentials = {
    type: "service_account",
    project_id: "emailreminderuk",
    private_key_id: "809d7f6c49e0ef04b2f8dee8ca2ea0e8a98c6a4b",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2CUn04vavTOJB\nY8yQ0Y6zphxYQ4RdWQ42c+MQ2+2/6d6D4Sux9vTcCJS+n2HBa1anfTzUxND+B+Qt\n7/URRJPb39q+LxY8dZlzCIRvZ38v70BkHEzoyY95LFExL2DXoDXI3r2PrAZobAqV\ndlT81NmM8CVeGRjOMYi+Dvx+/MdL9IUSW256RXT+vCIk9xZyt6FDu6Pq4zgKSvu7\nMlBrBxotCr08HHMujeUyLWxVy/HQhOGn+gPqI4rT/KRmOAX+BzjgdVL/SyStEr93\nUOYmAuylApFQ7vUeUQIQtsUmg9T6A/UnirQMhHf/omTMQLgpWxv/W4+ZkSh/JojP\nNPxt5kJFAgMBAAECggEAN1kargVGWSWo05X7EHtPBst2adXZjKJzwlW5EBq2rrf2\nqqWPqhQ6/h3z0APY7rzqw5E+KjlPjDWtCNShcGcoB94H/fSGL8rX5dSMo+zVjKcT\nrny2W79RStgRNcHAkb9KKzGidGkrJ5vWGfy5OYikPwiTbAl4c9U2zQb0ec308OA8\nF+tYnr4C4OxAepj3keSHo4SgQadGdcOVlwrDkg7GEDxxcZ/a6KXLlkBJFWIRmJ2B\n7B32NsrXd5S5PiSxTw5OtWayxtYv+Gy7CsAeIZ4JxPZrEejU2gb3Wvjd8zXqWEhq\nPO+/tUz5v+crPk0m6Aynll2kN1NPjoBmKD9zGPMYDwKBgQDi4z84uAUyMGRz3Zms\n91bmJpFh8ZGMgA6/AbUaPElQ7Bbst130n2tkFMY2BXuHxcL2EJQmLgYu2RQflBCX\n4EpzoasuJwsFSCD0JvNTK8GCOYlIPXxMb/KGYfeMcP2myvxDC2yoI4oLdYeWiV5W\n7sp39f4QJR/S3fQfARcO00II3wKBgQDNZMYWk9UU3yUdi0NbEbVPZVZaLKmZ857U\nHvVRnRnVum3cWZYkDpBM0DFsSgRb5ruKiRgSb++5AFi8Lmd+To/NRahcIdvqtn78\nSank/2Efw8BAx2TGLh4gZB79+Hqn3rZdvnyvBIUxSIOprDuYN/tfqDLlPMGRHVwB\nDbJG4xdFWwKBgDb5Bo1wkNm7PeuQ6rYs66IyABGyHSjksi33dPDZYI451cgfGaW2\npqeGHQxjwa2A7h7+n1as2hSpxiVsk6So1IE1z6sMDLCH7Gwbr+Mb+/PYivm05BQF\nH8cNn5QooFy0W/DGqNoIWl8yZ9rCh9gaXXY5ZQh2ZkKKQqbsdbDC4QITAoGBAJwG\nCVPtSNhqCk+/EpODiC+f01D8zHleTzDjs4cjyBRLYlkY1KzfQ06WeHTCZT1KsPwz\n2E1pKrlmQgHxXjzcgPB2EcarEdvideRAMQb72FPA57JNxYemUMxaQhC7SLFsxSvB\nIAXzcRpW821YoIypOhMYOlFZLdGGc/V46gxfRbYxAoGAc8yn7nRgT5TWjq/N9vmY\nPcff9iAhCTxcWYLMra29YGH/Pd3GhWmskOXJ2n4arzr09QXXdV5rWUFMsVAs/c+n\nBKY3ZEAbYl+G2Uf2K5Ezdp4oLD8zkWE1YfpEJ55WrKBxdzuCcJ8lOi8VDTHMDYZL\nLPEsIkSvQ3JFAEG1LGxBR24=\n-----END PRIVATE KEY-----\n",
    client_email: "ukemailreminder@emailreminderuk.iam.gserviceaccount.com",
    client_id: "109649408004760166716",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/ukemailreminder%40emailreminderuk.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
};

const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
    ]
);

module.exports = {
    drive: google.drive({ version: "v3", auth }),
    sheets: google.sheets({ version: "v4", auth })
};