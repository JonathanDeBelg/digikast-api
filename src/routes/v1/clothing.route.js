const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const clothingController = require('../../controllers/clothing.controller');
const clothingValidation = require('../../validations/clothing.validation');

const router = express.Router();
const upload = multer();

router.route('/closet/:closet/').get(auth(), clothingController.getClothes);
router.route('/set/:closet').get(auth(), clothingController.getGarmentSetsByClosetId);
router
  .route('/set/')
  .get(auth(), clothingController.getAllGarmentSets)
  .post([auth(), validate(clothingValidation.createGarmentSet)], clothingController.createGarmentSet);

router
  .route('/:closet/:garmentId')
  .get(auth(), clothingController.getGarment)
  .put(auth(), clothingController.updateGarment)
  .delete(auth(), clothingController.deleteGarment);

router
  .route('/:closet/:garmentId/changeCloset')
  .post(auth(), clothingController.changeGarmentCloset)

router
  .route('/:closet/:garment/comparableItems')
  .get(auth(), clothingController.getComperableGarments);

router
  .route('/')
  .get(auth(), clothingController.getAllClothes)
  .post(upload.single('image'), [auth(), validate(clothingValidation.create)], function (req, res, next) {
    return clothingController.createGarment(req, res, next);
  });

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Closets
 *   description: Closet management and retrieval
 */

/**
 * @swagger
 * /closets:
 *   post:
 *     summary: Create a closet
 *     tags: [Closets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                  type: string
 *                  enum: [FREE, TRAIL, FAMILIY, NORMAL]
 *             example:
 *               name: Kast zomer
 *               email: FREE
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Closet'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all closets
 *     tags: [Closets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Closet name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Closet type
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Closet'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /closets/{id}:
 *   get:
 *     summary: Get a Closet
 *     description: Logged in users can fetch only their own closet information
 *     tags: [Closet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Closet id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
