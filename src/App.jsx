import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  createTheme,
} from '@mui/material';
import { DarkMode, LightMode, Translate } from '@mui/icons-material';

const BDT_CODE = 'BDT';
const BDT_SYMBOL = '৳';
const INCENTIVE_RATE = 0.025;

const CURRENCY_SYMBOLS = {
  AED: 'د.إ',
  SAR: '﷼',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  OMR: 'ر.ع.',
  BHD: '.د.ب',
  USD: '$',
  GBP: '£',
  BDT: BDT_SYMBOL,
  XXX: '¤',
};

const COUNTRY_CURRENCY_MAP = {
  'UAE (Dirham)': { key: 'UAE (Dirham)', code: 'AED', symbol: 'د.إ', defaultRate: 33.0, defaultFee: 15, defaultAmount: 1000, flag: '🇦🇪' },
  'Saudi Arabia (Riyal)': { key: 'Saudi Arabia (Riyal)', code: 'SAR', symbol: '﷼', defaultRate: 31.0, defaultFee: 20, defaultAmount: 1000, flag: '🇸🇦' },
  'Kuwait (Dinar)': { key: 'Kuwait (Dinar)', code: 'KWD', symbol: 'د.ك', defaultRate: 380.0, defaultFee: 3, defaultAmount: 200, flag: '🇰🇼' },
  'Qatar (Riyal)': { key: 'Qatar (Riyal)', code: 'QAR', symbol: 'ر.ق', defaultRate: 32.2, defaultFee: 18, defaultAmount: 1000, flag: '🇶🇦' },
  'Oman (Rial)': { key: 'Oman (Rial)', code: 'OMR', symbol: 'ر.ع.', defaultRate: 300.0, defaultFee: 5, defaultAmount: 100, flag: '🇴🇲' },
  'Bahrain (Dinar)': { key: 'Bahrain (Dinar)', code: 'BHD', symbol: '.د.ب', defaultRate: 315.0, defaultFee: 4, defaultAmount: 150, flag: '🇧🇭' },
  'USA (Dollar)': { key: 'USA (Dollar)', code: 'USD', symbol: '$', defaultRate: 117.0, defaultFee: 5, defaultAmount: 500, flag: '🇺🇸' },
  'United Kingdom (Pound)': { key: 'United Kingdom (Pound)', code: 'GBP', symbol: '£', defaultRate: 148.0, defaultFee: 7, defaultAmount: 300, flag: '🇬🇧' },
  'Custom Country': { key: 'Custom Country', code: 'XXX', symbol: '¤', defaultRate: 100, defaultFee: 0, defaultAmount: 500, flag: '🌐' },
};

const LANGUAGE_MAP = {
  en: {
    title: '🇧🇩 Remittance Calculator',
    langToggle: 'বাংলা',
    modeSend: 'Send Money',
    modeReverse: 'Reverse Calculation',
    selectCurrency: 'Your Sending Country / Currency',
    amountLabelSend: 'Amount to Send ({fcc})',
    amountLabelReverse: 'Target BDT to Receive ({BDT_CODE})',
    rateLabel: 'Exchange Rate ({BDT_CODE} per 1 {fcc})',
    feeLabel: 'Bank/Transfer Fee ({fcc})',
    resultsHeader: 'Calculation Results',
    netConverted: 'Net {fcc} Converted (Amount - Fee)',
    feeDeducted: 'Bank/Transfer Fee ({fcc})',
    bdtGross: 'Gross BDT Value (before incentive)',
    incentiveAdded: 'Remittance Incentive (+2.5% on BDT Gross)',
    totalBdtReceived: 'TOTAL BDT RECEIVED',
    effectiveRateLabel: 'Effective Rate (Including Incentive)',
    summaryMessage: 'To receive {bdtResult}, you need to send {fccInput} in total, including the bank fee and incentive.',
    incentiveRemovedReverse: 'Incentive Removed (-2.5% BDT)',
    bdtBaseAmount: 'Net BDT Value (After Incentive Removed)',
    fccNeededPreFee: 'Net {fcc} Needed (To achieve BDT after incentive)',
    totalFccToSend: 'TOTAL {fcc} TO SEND (Including Fee)',
    errFeeGreater: 'Error: Transfer amount ({amount}) is less than the fee ({fee}).',
    errInvalid: 'Enter valid positive amounts and exchange rate. Fee can be zero.',
    customCurrencyCode: 'Custom Currency Code (e.g., QAR)',
    customRate: 'Custom Exchange Rate',
    footerPrefix: 'Made with ❤️ by',
  },
  bn: {
    title: '🇧🇩 রেমিট্যান্স ক্যালকুলেটর',
    langToggle: 'English',
    modeSend: 'টাকা পাঠান',
    modeReverse: 'বিপরীত হিসাব',
    selectCurrency: 'আপনার প্রেরক দেশ / মুদ্রা',
    amountLabelSend: 'প্রেরণের পরিমাণ ({fcc})',
    amountLabelReverse: 'প্রাপ্য বিডিটি (BDT) পরিমাণ ({BDT_CODE})',
    rateLabel: 'বিনিময় হার ({BDT_CODE} প্রতি ১ {fcc})',
    feeLabel: 'ব্যাংক/ট্রান্সফার ফি ({fcc})',
    resultsHeader: 'হিসাবের ফলাফল',
    netConverted: 'মোট {fcc} কনভার্টেড (পরিমাণ - ফি)',
    feeDeducted: 'ব্যাংক/ট্রান্সফার ফি ({fcc})',
    bdtGross: 'মোট বিডিটি মূল্য (প্রণোদনা ছাড়া)',
    incentiveAdded: 'রেমিট্যান্স প্রণোদনা (+২.৫% মোট বিডিটি মূল্যের উপর)',
    totalBdtReceived: 'সর্বমোট প্রাপ্ত বিডিটি (BDT)',
    effectiveRateLabel: 'প্রণোদনা সহ কার্যকর রেট',
    summaryMessage: '{bdtResult} টাকা পেতে, ২.৫% প্রণোদনা ও ব্যাংক ফি সহ আপনাকে মোট {fccInput} পাঠাতে হবে।',
    incentiveRemovedReverse: 'বাদ দেওয়া প্রণোদনা (-২.৫% BDT)',
    bdtBaseAmount: 'নেট BDT মূল্য (প্রণোদনা বাদ দেওয়ার পর)',
    fccNeededPreFee: 'প্রয়োজনীয় নেট {fcc} (রূপান্তরের পর)',
    totalFccToSend: 'সর্বমোট {fcc} পাঠাতে হবে (ফি সহ)',
    errFeeGreater: 'ত্রুটি: প্রেরণের পরিমাণ ({amount}) ফি ({fee}) এর চেয়ে কম।',
    errInvalid: 'বৈধ ধনাত্মক পরিমাণ ও বিনিময় হার দিন। ফি শূন্য হতে পারে।',
    customCurrencyCode: 'কাস্টম মুদ্রার কোড (যেমন: QAR)',
    customRate: 'কাস্টম বিনিময় হার',
    footerPrefix: 'তৈরি করেছেন ❤️',
  },
};

function formatCurrency(value, currencyCode) {
  if (Number.isNaN(value) || value === null) {
    return `0.00 ${CURRENCY_SYMBOLS[currencyCode] ?? currencyCode}`;
  }

  const symbol = CURRENCY_SYMBOLS[currencyCode] ?? currencyCode;
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  const symbolAfter =
    currencyCode === BDT_CODE ||
    currencyCode === 'AED' ||
    currencyCode === 'SAR' ||
    currencyCode === 'QAR' ||
    currencyCode === 'OMR' ||
    currencyCode === 'BHD' ||
    currencyCode === 'KWD';

  return symbolAfter ? `${formattedValue} ${symbol}` : `${symbol}${formattedValue}`;
}

function formatRate(value) {
  if (Number.isNaN(value) || value === null) {
    return '0.0000';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function getTranslation(lang, currency, key, values = {}) {
  let text = LANGUAGE_MAP[lang][key] ?? key;
  const bdtSymbol = CURRENCY_SYMBOLS[BDT_CODE];

  text = text.replace(/{fcc}/g, currency.symbol).replace(/{BDT_CODE}/g, bdtSymbol);

  Object.entries(values).forEach(([valueKey, value]) => {
    text = text.replace(new RegExp(`{${valueKey}}`, 'g'), value);
  });

  return text;
}

function buildTheme(themeMode) {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#0d47a1',
      },
      secondary: {
        main: '#00897b',
      },
      background:
        themeMode === 'dark'
          ? {
              default: '#0a0f1f',
              paper: '#10192d',
            }
          : {
              default: '#eef3fb',
              paper: '#ffffff',
            },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Poppins", "Noto Sans Bengali", "Hind Siliguri", sans-serif',
    },
  });
}

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'bn');
  const [mode, setMode] = useState('SEND');
  const [currencyKey, setCurrencyKey] = useState('UAE (Dirham)');
  const [amount, setAmount] = useState(COUNTRY_CURRENCY_MAP['UAE (Dirham)'].defaultAmount.toString());
  const [rate, setRate] = useState(COUNTRY_CURRENCY_MAP['UAE (Dirham)'].defaultRate.toString());
  const [fee, setFee] = useState(COUNTRY_CURRENCY_MAP['UAE (Dirham)'].defaultFee.toString());
  const [customCode, setCustomCode] = useState('XXX');
  const [customRate, setCustomRate] = useState('100');

  const baseCurrency = COUNTRY_CURRENCY_MAP[currencyKey];
  const isCustom = baseCurrency.key === 'Custom Country';

  const currentCurrency = useMemo(() => {
    if (!isCustom) {
      return baseCurrency;
    }

    const normalizedCode = (customCode || 'XXX').toUpperCase().slice(0, 3);
    return {
      ...baseCurrency,
      code: normalizedCode || 'XXX',
      symbol: CURRENCY_SYMBOLS[normalizedCode] || '¤',
    };
  }, [baseCurrency, customCode, isCustom]);

  const theme = useMemo(() => buildTheme(themeMode), [themeMode]);

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    if (!isCustom) {
      setAmount(baseCurrency.defaultAmount.toString());
      setRate(baseCurrency.defaultRate.toString());
      setFee(baseCurrency.defaultFee.toString());
    }
  }, [baseCurrency, isCustom]);

  const t = (key, values = {}) => getTranslation(lang, currentCurrency, key, values);

  const calculation = useMemo(() => {
    const amountValue = parseFloat(amount) || 0;
    const rateValue = isCustom ? parseFloat(customRate) || 0 : parseFloat(rate) || 0;
    const feeValue = parseFloat(fee) || 0;

    if (amountValue < 0 || rateValue <= 0 || feeValue < 0) {
      return { error: t('errInvalid'), data: null };
    }

    if (mode === 'SEND') {
      const netForeignToSend = amountValue - feeValue;

      if (netForeignToSend < 0) {
        return {
          error: t('errFeeGreater', {
            amount: formatCurrency(amountValue, currentCurrency.code),
            fee: formatCurrency(feeValue, currentCurrency.code),
          }),
          data: null,
        };
      }

      const bdtGross = netForeignToSend * rateValue;
      const incentive = bdtGross * INCENTIVE_RATE;
      const totalBDT = bdtGross + incentive;
      const effectiveRate = rateValue * (1 + INCENTIVE_RATE);

      return {
        error: null,
        data: {
          effectiveRate,
          linePrimaryLabel: t('netConverted'),
          linePrimaryValue: formatCurrency(netForeignToSend, currentCurrency.code),
          feeLabel: t('feeDeducted'),
          feeValue: formatCurrency(feeValue, currentCurrency.code),
          baseLabel: t('bdtGross'),
          baseValue: formatCurrency(bdtGross, BDT_CODE),
          incentiveLabel: t('incentiveAdded'),
          incentiveValue: formatCurrency(incentive, BDT_CODE),
          totalLabel: t('totalBdtReceived'),
          totalValue: formatCurrency(totalBDT, BDT_CODE),
          summary: t('summaryMessage', {
            bdtResult: formatCurrency(totalBDT, BDT_CODE),
            fccInput: formatCurrency(amountValue, currentCurrency.code),
          }),
        },
      };
    }

    const bdtTarget = amountValue;
    const bdtWithoutIncentive = bdtTarget / (1 + INCENTIVE_RATE);
    const incentiveRemoved = bdtTarget - bdtWithoutIncentive;
    const fccNeededPreFee = bdtWithoutIncentive / rateValue;
    const totalFcc = fccNeededPreFee + feeValue;

    return {
      error: null,
      data: {
        effectiveRate: rateValue * (1 + INCENTIVE_RATE),
        linePrimaryLabel: t('fccNeededPreFee'),
        linePrimaryValue: formatCurrency(fccNeededPreFee, currentCurrency.code),
        feeLabel: t('feeDeducted'),
        feeValue: formatCurrency(feeValue, currentCurrency.code),
        baseLabel: t('bdtBaseAmount'),
        baseValue: formatCurrency(bdtWithoutIncentive, BDT_CODE),
        incentiveLabel: t('incentiveRemovedReverse'),
        incentiveValue: formatCurrency(incentiveRemoved, BDT_CODE),
        totalLabel: t('totalFccToSend'),
        totalValue: formatCurrency(totalFcc, currentCurrency.code),
        summary: t('summaryMessage', {
          bdtResult: formatCurrency(bdtTarget, BDT_CODE),
          fccInput: formatCurrency(totalFcc, currentCurrency.code),
        }),
      },
    };
  }, [amount, currentCurrency, customRate, fee, isCustom, mode, rate, t]);

  const handleModeChange = (_, nextMode) => {
    if (!nextMode) {
      return;
    }

    setMode(nextMode);

    if (nextMode === 'SEND') {
      setAmount(baseCurrency.defaultAmount.toString());
    } else {
      setAmount('100000');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 3, md: 6 },
          background:
            themeMode === 'dark'
              ? 'radial-gradient(circle at top left, #13213d, #0a0f1f 58%)'
              : 'radial-gradient(circle at top left, #dfeeff, #eef3fb 58%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={10}
            sx={{
              px: { xs: 2, sm: 3.5 },
              py: { xs: 3, sm: 4 },
              borderRadius: 6,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.25 }}>
                {t('title')}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Translate />}
                  onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                  sx={{ borderRadius: 99 }}
                >
                  {t('langToggle')}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                  sx={{ minWidth: 0, px: 1.2, borderRadius: 99 }}
                >
                  {themeMode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={2.2}>
              <FormControl fullWidth>
                <InputLabel id="currency-select-label">{t('selectCurrency')}</InputLabel>
                <Select
                  labelId="currency-select-label"
                  label={t('selectCurrency')}
                  value={currencyKey}
                  onChange={(event) => setCurrencyKey(event.target.value)}
                >
                  {Object.entries(COUNTRY_CURRENCY_MAP).map(([key, cfg]) => (
                    <MenuItem key={key} value={key}>
                      {cfg.flag} {key} ({cfg.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {isCustom && (
                <Stack spacing={2}>
                  <TextField
                    label={t('customCurrencyCode')}
                    value={customCode}
                    onChange={(event) => setCustomCode(event.target.value.toUpperCase().slice(0, 3))}
                    inputProps={{ maxLength: 3 }}
                    fullWidth
                  />
                  <TextField
                    type="number"
                    label={`${t('customRate')} (${CURRENCY_SYMBOLS[BDT_CODE]} per 1 ${(customCode || 'XXX').toUpperCase().slice(0, 3) || 'XXX'})`}
                    value={customRate}
                    onChange={(event) => setCustomRate(event.target.value)}
                    fullWidth
                  />
                </Stack>
              )}

              <ToggleButtonGroup
                color="primary"
                exclusive
                value={mode}
                onChange={handleModeChange}
                fullWidth
                sx={{ '& .MuiToggleButton-root': { py: 1 } }}
              >
                <ToggleButton value="SEND">{t('modeSend')}</ToggleButton>
                <ToggleButton value="REVERSE">{t('modeReverse')}</ToggleButton>
              </ToggleButtonGroup>

              <TextField
                type="number"
                label={mode === 'SEND' ? t('amountLabelSend') : t('amountLabelReverse')}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                fullWidth
              />

              {!isCustom && (
                <TextField
                  type="number"
                  label={t('rateLabel')}
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  fullWidth
                />
              )}

              <TextField
                type="number"
                label={t('feeLabel')}
                value={fee}
                onChange={(event) => setFee(event.target.value)}
                fullWidth
              />
            </Stack>

            <Box mt={3.5}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                {t('resultsHeader')}
              </Typography>

              {calculation.error ? (
                <Alert severity="error">{calculation.error}</Alert>
              ) : (
                <Card variant="outlined" sx={{ borderRadius: 4 }}>
                  <CardContent>
                    <Stack spacing={1.6}>
                      <Chip
                        label={`${t('effectiveRateLabel')}: ${formatRate(calculation.data.effectiveRate)}`}
                        color="success"
                        variant="filled"
                      />

                      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'primary.50' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {calculation.data.linePrimaryLabel}
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>{calculation.data.linePrimaryValue}</Typography>
                        </Stack>
                      </Paper>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="error.main">
                          {calculation.data.feeLabel}
                        </Typography>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
                          {calculation.data.feeValue}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{calculation.data.baseLabel}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {calculation.data.baseValue}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="success.main">
                          {calculation.data.incentiveLabel}
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                          {calculation.data.incentiveValue}
                        </Typography>
                      </Stack>

                      <Paper
                        elevation={0}
                        sx={{
                          mt: 0.8,
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: 'primary.main',
                          color: '#fff',
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <Typography sx={{ fontWeight: 800 }}>{calculation.data.totalLabel}</Typography>
                          <Typography sx={{ fontWeight: 900, fontSize: '1.45rem' }}>{calculation.data.totalValue}</Typography>
                        </Stack>
                      </Paper>

                      <Alert severity="info" variant="outlined">
                        {calculation.data.summary}
                      </Alert>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Paper>

          <Typography variant="body2" color="text.secondary" align="center" mt={2.4}>
            {t('footerPrefix')}{' '}
            <Link href="http://ainulislam.info" target="_blank" rel="noreferrer" underline="hover" sx={{ fontWeight: 700 }}>
              Ainul Islam
            </Link>
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
