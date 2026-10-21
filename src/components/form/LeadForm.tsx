import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { APPLY, FORMAT_OPTIONS } from '@/content/content';
import { CONTACT_LIST } from '@/lib/config';
import { track } from '@/lib/analytics';
import { leadSchema, type LeadValues } from './leadSchema';
import { buildPayload, submitLead } from './submitLead';
import { openPrivacyPolicy } from '@/lib/privacyConsent';

type FormatValue = LeadValues['format'];

interface Props {
  format: FormatValue;
  onFormatChange: (value: FormatValue) => void;
}

export function LeadForm({ format, onFormatChange }: Props) {
  const navigate = useNavigate();
  const started = useRef(false);
  const [networkError, setNetworkError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      format,
      consent: false,
      company: '',
    },
    mode: 'onSubmit',
  });

  // Синхронизация с вкладкой форматов (раздел 7 ТЗ).
  useEffect(() => {
    setValue('format', format);
  }, [format, setValue]);

  const onFirstInteraction = () => {
    if (started.current) return;
    started.current = true;
    track('form_start');
  };

  const onValid = async (values: LeadValues) => {
    setNetworkError(false);
    try {
      await submitLead(buildPayload(values, 'apply_form'));
      track('form_submit', { format: values.format, city: values.city.trim() });
      navigate('/thanks', { state: { name: values.name.trim() } });
    } catch {
      setNetworkError(true);
    }
  };

  const onInvalid = (formErrors: FieldErrors<LeadValues>) => {
    for (const field of Object.keys(formErrors)) track('form_error', { field });
  };

  const fields = APPLY.form.fields;

  return (
    <form
      className="formcard"
      id="lead"
      noValidate
      onSubmit={handleSubmit(onValid, onInvalid)}
      onFocus={onFirstInteraction}
      onChange={onFirstInteraction}
    >
      <h3>{APPLY.form.title}</h3>
      <p className="formcard__sub">{APPLY.form.sub}</p>

      <div className="field">
        <label htmlFor="f-name">{fields.name.label}</label>
        <input
          id="f-name"
          type="text"
          autoComplete="given-name"
          placeholder={fields.name.placeholder}
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'e-name' : undefined}
          {...register('name')}
        />
        {errors.name ? (
          <span className="field__error" id="e-name" role="alert">
            {errors.name.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="f-phone">{fields.phone.label}</label>
        <input
          id="f-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={fields.phone.placeholder}
          aria-invalid={errors.phone ? 'true' : undefined}
          aria-describedby={errors.phone ? 'e-phone' : undefined}
          {...register('phone')}
        />
        {errors.phone ? (
          <span className="field__error" id="e-phone" role="alert">
            {errors.phone.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="f-city">{fields.city.label}</label>
        <input
          id="f-city"
          type="text"
          autoComplete="address-level2"
          placeholder={fields.city.placeholder}
          aria-invalid={errors.city ? 'true' : undefined}
          aria-describedby={errors.city ? 'e-city' : undefined}
          {...register('city')}
        />
        {errors.city ? (
          <span className="field__error" id="e-city" role="alert">
            {errors.city.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="f-format">{fields.format.label}</label>
        <select
          id="f-format"
          {...register('format', {
            onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
              onFormatChange(event.target.value as FormatValue),
          })}
        >
          {FORMAT_OPTIONS.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* honeypot — раздел 8.2 ТЗ */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">Компания</label>
        <input
          id="f-company"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>

      <div className="consent">
        <input
          id="f-consent"
          type="checkbox"
          aria-invalid={errors.consent ? 'true' : undefined}
          aria-describedby={errors.consent ? 'e-consent' : undefined}
          {...register('consent')}
        />
        <label htmlFor="f-consent">
          {fields.consent.label} —{' '}
          <button
            className="privacy-policy-link"
            type="button"
            onClick={openPrivacyPolicy}
          >
            политика обработки данных
          </button>
          {errors.consent ? (
            <span className="field__error" id="e-consent" role="alert">
              {errors.consent.message}
            </span>
          ) : null}
        </label>
      </div>

      <button className="btn btn--block" type="submit" disabled={isSubmitting}>
        {isSubmitting ? APPLY.form.submitting : APPLY.form.submit}
      </button>

      {networkError ? (
        <p className="form__status" role="alert">
          {APPLY.form.errors.network}
        </p>
      ) : null}

      {CONTACT_LIST.length > 0 ? (
        <div className="form__alt">
          <span>{APPLY.form.altLabel}</span>
          {CONTACT_LIST.map(([channel, href]) => (
            <a
              key={channel}
              href={href}
              target="_blank"
              rel="noopener"
              onClick={() => track('messenger_click', { channel })}
            >
              {channel}
            </a>
          ))}
        </div>
      ) : null}
    </form>
  );
}
