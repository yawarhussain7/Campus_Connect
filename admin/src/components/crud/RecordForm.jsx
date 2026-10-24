import { useState } from "react";
import { BookOpenCheck } from "lucide-react";

import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import { Checkbox, Field, Input, Select, Textarea } from "../ui/Field";

function initialValues(fields, record) {
  const values = {};

  for (const field of fields) {
    const current = record?.[field.name];

    if (field.type === "file") {
      values[field.name] = null;
      continue;
    }

    if (field.type === "checkbox") {
      values[field.name] = Boolean(current ?? field.defaultValue ?? false);
      continue;
    }

    values[field.name] = current ?? field.defaultValue ?? "";
  }

  return values;
}

function validate(fields, values, record) {
  const errors = {};

  for (const field of fields) {
    if (field.type === "file") {
      if (field.requiredOnCreate && !record && !values[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
      continue;
    }

    if (field.type === "checkbox") continue;

    const text = String(values[field.name] ?? "").trim();

    if (text === "") {
      if (field.required) errors[field.name] = `${field.label} is required`;
      continue;
    }

    if (field.pattern && !field.pattern.test(text)) {
      errors[field.name] = field.patternMessage ?? `${field.label} is not valid`;
      continue;
    }

    const message = field.check?.(text, values);

    if (message) errors[field.name] = message;
  }

  return errors;
}

/** Numbers become numbers; everything else is trimmed to a string. */
function coerce(fields, values) {
  const output = {};

  for (const field of fields) {
    const value = values[field.name];

    if (field.type === "file") {
      if (value) output[field.name] = value;
    } else if (field.type === "checkbox") output[field.name] = Boolean(value);
    else if (field.type === "number")
      output[field.name] = value === "" ? null : Number(value);
    else output[field.name] = String(value ?? "").trim();
  }

  return output;
}

/** Create / edit form rendered in a right-hand drawer. */
export default function RecordForm({
  fields,
  record,
  title,
  description,
  submitLabel,
  checkingUpload = false,
  checkingTitle = "Checking file",
  submitError = "",
  onSubmit,
  onClose,
}) {
  // Mounted only while open, so mounting is what seeds the form.
  const [values, setValues] = useState(() => initialValues(fields, record));
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(fields, values, record);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(coerce(fields, values));
  };

  const control = (field) => {
    const id = `field-${field.name}`;
    const invalid = Boolean(errors[field.name]);
    const set = (value) => setValue(field.name, value);

    if (field.type === "file") {
      return (
        <div>
          <Input
            id={id}
            type="file"
            accept={field.accept}
            invalid={invalid}
            onChange={(event) => set(event.target.files?.[0] ?? null)}
          />
          {values[field.name]?.name ? (
            <p className="mt-1.5 text-[11.5px] text-slate-500">
              Selected: {values[field.name].name}
            </p>
          ) : null}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <Select
          id={id}
          invalid={invalid}
          value={values[field.name] ?? ""}
          onChange={(event) => set(event.target.value)}
        >
          {(field.options ?? []).map((option) => {
            // Plain strings double as value and label; { value, label } pairs
            // let a form show "Student" while storing "user".
            const value = typeof option === "object" ? option.value : option;
            const label = typeof option === "object" ? option.label : option;

            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Select>
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          id={id}
          rows={field.rows ?? 3}
          invalid={invalid}
          placeholder={field.placeholder}
          value={values[field.name] ?? ""}
          onChange={(event) => set(event.target.value)}
        />
      );
    }

    return (
      <Input
        id={id}
        min={field.min}
        max={field.max}
        step={field.step}
        invalid={invalid}
        placeholder={field.placeholder}
        value={values[field.name] ?? ""}
        type={
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "password"
                ? "password"
                : "text"
        }
        onChange={(event) => set(event.target.value)}
      />
    );
  };

  return (
    <>
    <Drawer
      open
      onClose={onClose}
      width="lg"
      title={title}
      description={description}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" form="record-form">
            {submitLabel}
          </Button>
        </div>
      }
    >
      <form
        id="record-form"
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {submitError ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] leading-5 text-red-700 sm:col-span-2"
          >
            {submitError}
          </div>
        ) : null}
        {fields.filter((field) => !(field.createOnly && record)).map((field) =>
          field.type === "checkbox" ? (
            <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
              <Checkbox
                id={`field-${field.name}`}
                label={field.checkboxLabel ?? field.label}
                checked={Boolean(values[field.name])}
                onChange={(event) => setValue(field.name, event.target.checked)}
              />
            </div>
          ) : (
            <Field
              key={field.name}
              label={field.label}
              required={field.required}
              hint={field.hint}
              error={errors[field.name]}
              htmlFor={`field-${field.name}`}
              className={field.wide ? "sm:col-span-2" : ""}
            >
              {control(field)}
            </Field>
          )
        )}
      </form>
    </Drawer>
    {checkingUpload ? (
      <div
        className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-label={checkingTitle}
      >
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-7 py-8 text-center shadow-2xl shadow-slate-950/20">
          <div className="relative mx-auto grid h-20 w-20 place-items-center">
            <span className="absolute inset-0 rounded-full border border-indigo-100" />
            <span className="absolute inset-1 rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin" />
            <span className="absolute inset-3 rounded-full border-2 border-transparent border-b-emerald-500 animate-[spin_1.4s_linear_infinite_reverse]" />
            <BookOpenCheck className="h-7 w-7 text-slate-700" strokeWidth={1.8} />
          </div>

          <h2 className="mt-5 text-base font-semibold text-slate-900">{checkingTitle}</h2>
          <p className="mt-1.5 text-sm leading-5 text-slate-500">
            Checking the file content and subject relevance.
          </p>
          <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
            <span className="h-1 w-8 rounded-full bg-indigo-600 animate-pulse" />
            <span className="h-1 w-8 rounded-full bg-emerald-500 animate-pulse [animation-delay:150ms]" />
            <span className="h-1 w-8 rounded-full bg-slate-300 animate-pulse [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
