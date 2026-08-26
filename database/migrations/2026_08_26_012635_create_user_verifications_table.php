<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('id_type')->nullable();
            $table->string('id_number')->nullable();
            $table->string('last_name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('address')->nullable();
            $table->string('id_front_image')->nullable();
            $table->string('id_back_image')->nullable();
            $table->string('face_image')->nullable();
            $table->enum('status', ['pending','approved','rejected'])->default('pending');
            $table->text('remarks')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->index('user_id');
            $table->index('status');
            $table->index('id_type');
            $table->index('id_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_verifications');
    }
};
