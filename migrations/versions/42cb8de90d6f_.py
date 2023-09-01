"""empty message

Revision ID: 42cb8de90d6f
Revises: b495fb19d545
Create Date: 2023-08-30 11:01:18.627483

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42cb8de90d6f'
down_revision = 'b495fb19d545'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('producto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_precio', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('producto', schema=None) as batch_op:
        batch_op.drop_column('id_precio')

    # ### end Alembic commands ###