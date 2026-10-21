import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, useLanguage } from '@/content/Language';
import { BUSINESS_CONTACT, CONFIG } from '@/lib/config';
import { createLeadSchema, type LeadValues } from './leadSchema';
import { buildPayload, submitLead } from './submitLead';
import { track } from '@/lib/analytics';
import { PRIVACY_POLICY_VERSION } from '@/lib/privacyConsent';

interface Props {
  format: LeadValues['format'];
  city: string;
  onFormatChange: (format: LeadValues['format']) => void;
}
export function PrototypeLeadForm({ format, city, onFormatChange }: Props) {
  const { language, copy, isKg } = useLanguage();
  const navigate = useNavigate();
  const [budget, setBudget] = useState('200 000–400 000 сом');
  const [status, setStatus] = useState<'draft' | 'error' | null>(null);
  const messages = isKg
    ? {
        name: 'Атыңызды жазыңыз',
        phone: 'Телефон номерин текшериңиз: кеминде 9 сан',
        city: 'Шаарыңызды жазыңыз',
        consent: 'Маалыматтарды иштетүүгө макулдук керек',
        network: 'Жөнөтүү мүмкүн болгон жок. Кайра аракет кылыңыз.',
      }
    : {
        name: 'Напишите, как к вам обращаться',
        phone: 'Проверьте номер: не меньше 9 цифр',
        city: 'Укажите город',
        consent: 'Нужно согласие на обработку данных',
        network: 'Не получилось отправить заявку. Попробуйте ещё раз.',
      };
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<LeadValues>({
    resolver: zodResolver(createLeadSchema(messages)),
    defaultValues: {
      name: '',
      phone: '',
      city,
      format,
      // Submission itself is the affirmative action described beside the button.
      consent: true,
      company: '',
    },
  });
  useEffect(() => {
    setValue('format', format);
  }, [format, setValue]);
  useEffect(() => {
    if (city) setValue('city', city);
  }, [city, setValue]);
  useEffect(() => {
    if (isSubmitted) void trigger();
  }, [language, isSubmitted, trigger]);
  const consultation = isKg ? 'Кеңеш керек' : 'Нужна консультация';
  const formatLabel = (value: LeadValues['format']) =>
    value === 'b2g'
      ? isKg
        ? 'B2G — мектептеги класс'
        : 'B2G — класс в школе'
      : value === 'center'
        ? isKg
          ? 'Толук кандуу борбор'
          : 'Полноценный центр'
        : consultation;
  const budgetLabel =
    budget === 'consultation'
      ? consultation
      : budget === '700000+'
        ? isKg
          ? '700 000 сомдон жогору'
          : 'Более 700 000 сом'
        : budget;
  const onSubmit = async (values: LeadValues) => {
    setStatus(null);
    if (CONFIG.leadEndpoint) {
      try {
        await submitLead({
          ...buildPayload(values, 'apply_form'),
          budget: budgetLabel,
          language,
        });
        track('form_submit', { format: values.format });
        navigate('/thanks', { state: { name: values.name.trim() } });
      } catch {
        setStatus('error');
      }
      return;
    }
    const message = [
      isKg ? 'IT ADIS франшизасына өтүнмө' : 'Заявка на франшизу IT ADIS',
      `${copy.nameLabel}: ${values.name.trim()}`,
      `${copy.phoneLabel}: ${values.phone.trim()}`,
      `${copy.cityFormLabel}: ${values.city.trim()}`,
      `${copy.formFormatLabel}: ${formatLabel(values.format)}`,
      `${copy.budgetFormLabel}: ${budgetLabel}`,
      '',
      isKg
        ? `Өтүнмөдөгү маалыматтарды франшиза боюнча байланышуу үчүн иштетүүгө макулмун. Купуялуулук саясаты: ${PRIVACY_POLICY_VERSION}.`
        : `Согласен на обработку данных заявки для связи по франшизе. Политика конфиденциальности: ${PRIVACY_POLICY_VERSION}.`,
    ].join('\n');
    window.open(
      `https://wa.me/${BUSINESS_CONTACT.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
    setStatus('draft');
    track('whatsapp_draft_open', { format: values.format });
  };
  return (
    <form
      className="formcard prototype-form"
      id="lead"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3>
        <Copy id="formTitle" />
      </h3>
      <p className="formcard__sub">
        <Copy id="formText" />
      </p>
      {(['name', 'phone', 'city'] as const).map((field) => (
        <div className="field" key={field}>
          <label htmlFor={`f-${field}`}>
            <Copy
              id={
                field === 'name'
                  ? 'nameLabel'
                  : field === 'phone'
                    ? 'phoneLabel'
                    : 'cityFormLabel'
              }
            />
          </label>
          <input
            id={`f-${field}`}
            type={field === 'phone' ? 'tel' : 'text'}
            inputMode={field === 'phone' ? 'tel' : 'text'}
            autoComplete={
              field === 'name'
                ? 'given-name'
                : field === 'phone'
                  ? 'tel'
                  : 'address-level2'
            }
            placeholder={
              field === 'phone'
                ? '+996 …'
                : field === 'name'
                  ? isKg
                    ? 'Атыңыз'
                    : 'Имя'
                  : isKg
                    ? 'Шаар'
                    : 'Город'
            }
            aria-invalid={errors[field] ? 'true' : undefined}
            aria-describedby={errors[field] ? `e-${field}` : undefined}
            {...register(field)}
          />
          {errors[field] && (
            <span className="field__error" id={`e-${field}`} role="alert">
              {errors[field]?.message}
            </span>
          )}
        </div>
      ))}
      <div className="field">
        <label htmlFor="f-format">
          <Copy id="formFormatLabel" />
        </label>
        <select
          id="f-format"
          {...register('format', {
            onChange: (e) =>
              onFormatChange(e.target.value as LeadValues['format']),
          })}
        >
          {(['b2g', 'center', 'unknown'] as const).map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-budget">
          <Copy id="budgetFormLabel" />
        </label>
        <select
          id="f-budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        >
          <option>200 000–400 000 сом</option>
          <option>400 000–700 000 сом</option>
          <option value="700000+">
            {isKg ? '700 000 сомдон жогору' : 'Более 700 000 сом'}
          </option>
          <option value="consultation">{consultation}</option>
        </select>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input
          id="f-company"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>
      <p className="privacy-notice" id="form-privacy-notice">
        {isKg
          ? 'Баскычты басуу менен сиз '
          : 'Нажимая кнопку, вы соглашаетесь с '}
        <Link to="/privacy" target="_blank" rel="noopener noreferrer">
          {isKg ? 'купуялуулук саясаты' : 'политикой конфиденциальности'}
        </Link>
        {isKg
          ? ' менен макулдугуңузду бересиз жана франшиза боюнча байланышуу үчүн өтүнмөдөгү маалыматтарды иштетүүгө макул болосуз.'
          : ' и даёте согласие на обработку данных заявки для связи по франшизе.'}
      </p>
      <button
        className="btn btn--block"
        type="submit"
        disabled={isSubmitting}
        aria-describedby="form-privacy-notice"
      >
        {isSubmitting ? (
          isKg ? (
            'Жөнөтүлүүдө…'
          ) : (
            'Отправляем…'
          )
        ) : (
          <Copy id="sendBtn" />
        )}
      </button>
      <p
        className={`prototype-note ${status === 'error' ? 'form__status' : ''}`}
        role="status"
        aria-live="polite"
      >
        {status === 'error'
          ? messages.network
          : status === 'draft'
            ? isKg
              ? 'Даяр билдирүү менен WhatsApp ачылат. Маалыматты текшерип, билдирүүнү жөнөтүңүз.'
              : 'Откроется WhatsApp с подготовленным текстом. Проверьте данные и отправьте сообщение.'
            : ''}
      </p>
    </form>
  );
}
