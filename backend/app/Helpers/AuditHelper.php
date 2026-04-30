<?php

namespace App\Helpers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditHelper
{
    /**
     * Log an audit event
     *
     * @param  string  $action
     * @param  mixed  $model
     * @param  array|null  $old
     * @param  array|null  $new
     * @return void
     */
    public static function log($action, $model, $old = null, $new = null)
    {
        try {

            AuditLog::create([
                'user_id' => Auth::check() ? Auth::id() : null,
                'action' => $action,
                'model_type' => class_basename($model),
                'model_id' => $model->id ?? null,
                'old_values' => $old ? json_encode($old) : null,
                'new_values' => $new ? json_encode($new) : null,
            ]);

        } catch (\Exception $e) {
            // Prevent system crash if logging fails
            \Log::error('Audit Log Failed: '.$e->getMessage());
        }
    }
}
